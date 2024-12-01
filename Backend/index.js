const express = require("express");
const cors = require("cors");
const app = express();
const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const db_usuario = require('./models/Usuario');
const db_insumo = require('./models/Insumo');
const sqlite3 = require("sqlite3").verbose();

const PORT = 5000;

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

// Rutas existentes

const alertasRoutes = require("./routes/alertasRoutes");
const historial_insumoRoutes = require("./routes/historial_insumoRoutes");
const historial_sesionRoutes = require("./routes/historial_sesionRoutes");
const insumoRoutes = require("./routes/insumoRoutes");
const notificacionesRoutes = require("./routes/notificacionesRoutes");
const pronostico_insumoRoutes = require("./routes/pronostico_insumoRoutes");
const reporte_semanalRoutes = require("./routes/reporte_semanalRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const loginRoutes = require("./routes/login");


app.use(express.json()); // Middleware para procesar JSON en las solicitudes

app.use("/Alertas", alertasRoutes);
app.use("/Historial_Insumo", historial_insumoRoutes);
app.use("/Historial_Sesion", historial_sesionRoutes);
app.use("/Insumo", insumoRoutes);
app.use("/Notificaciones", notificacionesRoutes);
app.use("/Pronostico_Insumo", pronostico_insumoRoutes);
app.use("/Reporte_Semanal", reporte_semanalRoutes);
app.use("/Usuarios", usuarioRoutes);
app.use("/login", loginRoutes);

let tokens; // Inicializa la variable como indefinida al inicio del archivo

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

// Ruta para el callback de OAuth2
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code; // El código de autorización enviado por Google

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

    // Obtener la información del usuario
    const userInfo = await oauth2.userinfo.get({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('Información del usuario:', userInfo.data);

    const email = userInfo.data.email;
    const nombre = userInfo.data.name;

    // Consultar si el usuario ya existe en la base de datos
    db_usuario.get(
      `SELECT * FROM Usuario WHERE email = ?`,
      [email],
      async (err, usuario) => {
        if (err) {
          console.error('Error al buscar usuario:', err);
          return res.status(500).send('Error al buscar usuario.');
        }

        if (!usuario) {
          // Si el usuario no existe, lo creamos
          db_usuario.run(
            `INSERT INTO Usuario (nombre, email, contrasena, refresco) VALUES (?, ?, NULL, ?)`,
            [nombre, email, newTokens.refresh_token || 0],
            function (err) {
              if (err) {
                console.error('Error al crear usuario:', err);
                return res.status(500).send('Error al crear usuario.');
              }
              console.log('Usuario creado con ID:', this.lastID);
            }
          );
        } else {
          // Si el usuario ya existe, actualizamos el refresh_token
          db_usuario.run(
            `UPDATE Usuario SET refresco = ? WHERE email = ?`,
            [newTokens.refresh_token || 0, email],
            (err) => {
              if (err) {
                console.error('Error al actualizar usuario:', err);
                return res.status(500).send('Error al actualizar usuario.');
              }
              console.log('Usuario actualizado:', email);
            }
          );
        }

        // Redirigir al usuario a la página principal o a su perfil
        return res.redirect(
          `http://localhost:3000/inicio?token=${newTokens.access_token}&email=${userInfo.data.email}`
        );
      }
    );
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

// Definir la ruta protegida
app.get('/login-google', checkGoogleAuth, (req, res) => {
  res.send('Ruta protegida con autenticación de Google');
});


// Configuración de nodemailer con el servicio de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes usar otro servicio de correo
  auth: {
    user: 'juegosdecompu12@gmail.com', // Tu correo de Gmail
    pass: 'djqa pwbu kbcq afjz', // Usa una contraseña de aplicación si tienes habilitada la autenticación de dos factores
  },
});

// Función para enviar el correo
const enviarCorreo = async (destinatario, asunto, contenido) => {
  const mailOptions = {
    from: 'juegosdecompu12@gmail.com',
    to: destinatario,
    subject: asunto,
    text: contenido,  // Correo en formato texto
    html: `<strong>${contenido}</strong>`,  // Correo en formato HTML (opcional)
  };

  try {
    // Enviar correo
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: ', info.response);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

const verificarStock = async () => {
  try {
    // Obtener todos los usuarios
    db_usuario.all(`SELECT * FROM Usuario`, [], (err, usuarios) => {
      if (err) {
        console.error("Error al obtener usuarios:", err);
        return;
      }

      // Obtener insumos con bajo stock y no notificados
      db_insumo.all(
        `SELECT * FROM Insumo WHERE stock_actual < stock_minimo AND notificado = 0`,
        [],
        (err, insumosConBajoStock) => {
          if (err) {
            console.error("Error al obtener insumos:", err);
            return;
          }

          // Si hay insumos con bajo stock y no notificados
          if (insumosConBajoStock.length > 0) {
            const asunto = "Alerta de bajo stock";
            const contenido = `Los siguientes insumos tienen bajo stock: ${insumosConBajoStock
              .map((insumo) => insumo.nombre_insumo)
              .join(", ")}`;

            // Enviar correo a todos los usuarios
            usuarios.forEach((usuario) => {
              const destinatario = usuario.email; // Campo "email" en la tabla Usuario
              enviarCorreo(destinatario, asunto, contenido)
                .then(() => {
                  console.log(`Correo enviado a: ${destinatario}`);
                })
                .catch((error) => {
                  console.error(`Error al enviar correo a ${destinatario}:`, error);
                });
            });

            // Actualizar el campo 'notificado' a 1 para los insumos
            insumosConBajoStock.forEach((insumo) => {
              db_insumo.run(
                `UPDATE Insumo SET notificado = 1 WHERE id_insumo = ?`,
                [insumo.id_insumo],
                (err) => {
                  if (err) {
                    console.error(
                      `Error al actualizar notificado para insumo ${insumo.id_insumo}:`,
                      err
                    );
                  } else {
                    console.log(`Insumo ${insumo.id_insumo} actualizado como notificado.`);
                  }
                }
              );
            });
          }
        }
      );
    });
  } catch (error) {
    console.error("Error al verificar el stock o al enviar correos:", error);
  }
};

// Programar la ejecución periódica (cada minuto en este caso)
const iniciarVerificacionAutomatica = () => {
  // Ejecutar cada minuto (60000 ms)
  setInterval(verificarStock, 60000);
};

// Iniciar la verificación automática
iniciarVerificacionAutomatica();


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});