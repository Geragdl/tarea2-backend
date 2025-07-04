require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para leer JSON
app.use(express.json());

// Rutas
app.use('/users', userRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');

    // Iniciar servidor después de conexión exitosa
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err);
  });

