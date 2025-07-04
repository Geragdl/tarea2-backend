const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Crear un usuario nuevo
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si ya existe el usuario
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Usuario ya existe' });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login exitoso', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

