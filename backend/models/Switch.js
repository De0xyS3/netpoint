const mongoose = require('mongoose');

const PortSchema = new mongoose.Schema({
  port_number: Number,
  vlan: Number,
  status: Boolean, // Activo o inactivo
});

const SwitchSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  ports: [PortSchema], // Array de puertos
});

module.exports = mongoose.model('Switch', SwitchSchema);
