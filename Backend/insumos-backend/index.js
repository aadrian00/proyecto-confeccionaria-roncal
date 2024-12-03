const express = require('express');
const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');
const app = express();
const cors = require('cors');
const rutas = require('./routes/insumos');
const Usuario = require('./models/Usuario');
const { OAuth2Client } = require('google-auth-library');

app.use(cors({
  origin: 'http://localhost:3000', // Permite solicitudes solo desde el frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  credentials: true, // Permitir el uso de cookies o credenciales
}));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.use(express.json()); // Middleware para procesar JSON en las solicitudes


app.use('/api', rutas);


let tokens; // Inicializa la variable como indefinida al inicio del archivo

const tokensFilePath = path.join(__dirname, 'tokens.json'); 


const credentialsPath = path.join(__dirname, './client_secret_601410416648-60hmjausm1su3bgm93u3n68ml9h47tde.apps.googleusercontent.com (4).json'); // Ruta del archivo de credenciales
let credentials = {};

if (fs.existsSync(credentialsPath)) {
  credentials = JSON.parse(fs.readFileSync(credentialsPath));
} else {
  console.error('Archivo de credenciales no encontrado');
  process.exit(1);
}

// Configuración de OAuth2 utilizando las credenciales cargadas
const oauth2Client = new OAuth2Client(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0]
);
// Middleware para verificar si el usuario está autenticado con Google
const checkGoogleAuth = (req, res, next) => {
  if (!tokens || !tokens.access_token) {
    return res.redirect('/auth/google'); // Redirigir si no hay tokens
  }
  next();
};

module.exports = { oauth2Client };

app.get('/auth/google', (req, res) => {
  // Solo forzamos la autorización cuando no tenemos un refresh_token almacenado
  if (!tokens || !tokens.access_token || !tokens.refresh_token) {
    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',  // Para obtener el refresh_token
      prompt: 'consent',       // Forzar reautenticación solo cuando sea necesario
      scope: [
        'https://www.googleapis.com/auth/gmail.send',
        'openid',
        'email',
        'profile',
      ],
    });
    return res.redirect(authorizationUrl); // Redirige a Google si no hay autenticación
  }
  res.send('Ya estás autenticado');
});


app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;  // El código de autorización que Google envía

  if (!code) {
    return res.status(400).send('Authorization code not found.');
  }

  try {
    // Intercambiar el código por los tokens (access_token y refresh_token)
    const { tokens: newTokens } = await oauth2Client.getToken(code);
    console.log('Tokens obtenidos:', newTokens);

    oauth2Client.setCredentials(newTokens);

    const accessToken = newTokens.access_token;

    const oauth2 = google.oauth2({
      version: 'v2',
      auth: oauth2Client,
    });

    const userInfo = await oauth2.userinfo.get({
      headers: {
        Authorization: `Bearer ${accessToken}`,  // Pasa el access_token aquí
      },
    });

    console.log('Información del usuario:', userInfo.data);

    const email = userInfo.data.email;
    const nombre = userInfo.data.name;

    let usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      // Si el usuario no existe, lo creamos
      usuario = await Usuario.create({
        nombre: nombre,
        email: email,
        contraseña: null,  // No necesitamos contraseña si se registra con Google
        refresco: newTokens.refresh_token,  // Guardamos el refresh_token
      });
    } else {
      // Si el usuario ya existe, actualizamos el refresh_token
      usuario.refresco = newTokens.refresh_token;
      await usuario.save();
    }

    // Redirigir al usuario a la página principal o a su perfil
    return res.redirect(`http://localhost:3000/inicio?token=${newTokens.access_token}&email=${userInfo.data.email}`);

  } catch (error) {
    console.error('Error al obtener los tokens:', error);
    return res.status(500).send('Error en la autenticación');
  }
});

app.post('/refresh-token', async (req, res) => {
  const email = req.body.email; // El email del usuario cuyo refresh token necesitamos
  if (!email) {
    return res.status(400).send('Email es necesario.');
  }

  try {
    // Recuperamos el refresh_token del usuario desde la base de datos
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !usuario.refresco) {
      return res.status(404).send('Usuario no encontrado o refresh token no disponible.');
    }

    // Ahora obtenemos el refresh_token almacenado
    const refreshToken = usuario.refresco;
    const oauth2Client = new google.auth.OAuth2(
      credentials.web.client_id,
      credentials.web.client_secret,
      credentials.web.redirect_uris[0]
    );
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    // Usamos el refresh_token para obtener un nuevo access_token
    const { tokens } = await oauth2Client.refreshToken(refreshToken);
    console.log('Nuevo Access Token:', tokens.access_token);

    // Devuelves el nuevo access_token al frontend
    res.json({ access_token: tokens.access_token });

  } catch (error) {
    console.error('Error al renovar el token:', error);
    res.status(500).send('Error al renovar el token');
  }
});

/*app.post('/api/auth/google', async (req, res) => {
  const { idToken } = req.body; // Recibe el idToken desde el frontend

  try {
    // Verificar el idToken con Google
    const ticket = await oauth2Client.verifyIdToken({
      idToken: idToken,
      audience: credentials.web.client_id, // Verifica que el token corresponda a tu cliente de Google
    });

    const payload = ticket.getPayload();
    console.log(payload);
    const userId = payload.sub; // El ID del usuario

    // Aquí puedes crear un JWT para la sesión del usuario
    const jwtToken = jwt.sign({ userId }, 'your-secret-key', { expiresIn: '1h' });

    // Responder con el JWT al frontend
    res.json({
      success: true,
      token: jwtToken, // Envia el token al frontend para almacenar en localStorage
    });
  } catch (error) {
    console.error('Error al verificar el idToken:', error);
    res.status(400).json({ success: false, message: 'Error de autenticación con Google' });
  }
});*/

// Asegúrate de que los tokens se configuren correctamente en oauth2Client
const tokens1 = JSON.parse(fs.readFileSync(tokensFilePath));  // o el lugar donde guardes los tokens
if (tokens1 && tokens1.access_token) {
  oauth2Client.setCredentials(tokens1);  // Configura el oauth2Client con los tokens
} else {
  console.error('No se encontraron tokens de acceso.');
  // Llama a una ruta de reautenticación si es necesario
}

// Definir la ruta protegida
app.get('/login-google', checkGoogleAuth, (req, res) => {
  res.send('Ruta protegida con autenticación de Google');
});


// Otras rutas de la aplicación...
app.get('/', (req, res) => {
  res.send('Bienvenido a la aplicación');
});

// Iniciar el servidor
app.listen(5000, () => {
  console.log('Servidor corriendo en http://localhost:5000');
});
