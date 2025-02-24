const { InfluxDB } = require('@influxdata/influxdb-client');
require('dotenv').config(); // Cargar variables de entorno

const influxDB = new InfluxDB({
  url: process.env.INFLUXDB_URL, // URL de tu InfluxDB desde el .env
  token: process.env.INFLUXDB_TOKEN, // Token de autenticación desde el .env
});

const queryApi = influxDB.getQueryApi('GlobalHitss'); // Organización

module.exports = queryApi;
