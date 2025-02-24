const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  etiqueta: String,
  usuario: String,
  proyecto: String,
  activo: Boolean,
  switchIP: { type: String, required: true },
  vlan: String, // Nueva propiedad para VLAN
  port: Number, // Número de puerto asociado
});



const FloorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  svg: { type: String, default: '' },
  points: [PointSchema],
  snmpData: { type: Object, default: {} } // Nuevo campo
});


module.exports = mongoose.model('Floor', FloorSchema);
