const express = require('express');
const router = express.Router();
const { getSwitchData, getAllSwitchesData } = require('../services/switchService'); // Servicio para InfluxDB

// Obtener todos los switches desde InfluxDB
router.get('/', async (req, res) => {
  try {
    const switches = await getAllSwitchesData(); // Cambiado para usar InfluxDB
    res.status(200).json(switches);
  } catch (error) {
    console.error('Error al obtener los switches desde InfluxDB:', error);
    res.status(500).json({ message: 'Error al obtener los switches', error: error.message });
  }
});

// Obtener un switch específico por IP desde InfluxDB
router.get('/live/:ip', async (req, res) => {
  try {
    const { ip } = req.params;
    const switchData = await getSwitchData(ip); // Cambiado para usar InfluxDB
    res.status(200).json(switchData);
  } catch (error) {
    console.error(`Error al obtener el switch ${ip} desde InfluxDB:`, error);
    res.status(500).json({ message: 'Error al obtener el switch', error: error.message });
  }
});

// Agregar un switch nuevo (si necesitas guardar switches en MongoDB para otro propósito)
router.post('/', async (req, res) => {
  try {
    const { ip, name, ports } = req.body;
    const newSwitch = new Switch({ ip, name, ports }); // Esto sigue siendo MongoDB
    await newSwitch.save();
    res.status(201).json(newSwitch);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el switch', error: error.message });
  }
});

// Consultar todos los switches y sus puertos desde InfluxDB
router.get('/live', async (req, res) => {
  try {
    const data = await getAllSwitchesData(); // Consulta consolidada de todos los switches
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error al consultar los switches', error: error.message });
  }
});

module.exports = router;
