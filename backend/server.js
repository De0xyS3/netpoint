const express = require('express');
const http = require('http'); // Servidor HTTP para integrar con Socket.IO
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cron = require('node-cron');
const { syncSwitchData } = require('./services/syncService');

// Configuración de variables de entorno
dotenv.config();

// Conexión a la base de datos
connectDB();

// Inicialización del servidor
const app = express();
const server = http.createServer(app); // Crear servidor HTTP
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://10.172.0.93:3000', // La URL de tu frontend
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  },
});

// Configuración de CORS para permitir solo una IP específica
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://10.172.0.93:3000', // La URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
};
app.use(cors(corsOptions));

// Aumentar el límite de tamaño del cuerpo de la solicitud
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Socket.IO - Gestión de conexiones
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Opcional: Manejar eventos personalizados desde el cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Rutas
app.use('/api/floors', require('./routes/floors'));
app.use('/api/switches', require('./routes/switches'));

// Cron job para sincronización automática
cron.schedule('*/5 * * * *', async () => {
  console.log('Ejecutando sincronización automática...');
  try {
    await syncSwitchData();

    // Emitir evento de actualización a los clientes
    const updatedFloors = await require('./models/Floor').find();
    io.emit('floor-updates', updatedFloors);
  } catch (error) {
    console.error('Error durante la sincronización automática:', error);
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
