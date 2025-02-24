const Floor = require('../models/Floor');
const { getAllSwitchesData } = require('./switchService'); // Servicio de InfluxDB

// Sincronizar datos desde InfluxDB a MongoDB
const syncSwitchData = async () => {
  try {
    const allSwitches = await getAllSwitchesData(); // Obtener datos de InfluxDB

    for (const switchData of allSwitches) {
      const { ip, ports } = switchData;

      // Buscar todos los pisos relacionados con este switch
      const floors = await Floor.find({ "points.switchIP": ip });

      for (const floor of floors) {
        let hasChanges = false;

        // Iterar por los puntos del piso
        floor.points.forEach((point) => {
          if (point.switchIP === ip) {
            const portData = ports.find((p) => p.port_number === point.port);

            if (portData) {
              // Actualizar VLAN si cambió
              if (portData.vlan !== point.vlan) {
                console.log(
                  `Actualizando VLAN para el punto ${point._id}: ${point.vlan} -> ${portData.vlan}`
                );
                point.vlan = portData.vlan;
                hasChanges = true;
              }

              // Actualizar estado activo/inactivo si cambió
              if (portData.status !== point.activo) {
                console.log(
                  `Actualizando estado para el punto ${point._id}: ${point.activo} -> ${portData.status}`
                );
                point.activo = portData.status;
                hasChanges = true;
              }
            }
          }
        });

        if (hasChanges) {
          await floor.save(); // Guardar cambios si los hubo
          console.log(`Cambios guardados para el piso ${floor._id}`);
        }
      }
    }

    console.log('Sincronización completada.');
  } catch (error) {
    console.error('Error durante la sincronización:', error);
    throw error;
  }
};

module.exports = { syncSwitchData };
