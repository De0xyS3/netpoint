const express = require('express');
const router = express.Router();
const Floor = require('../models/Floor');


// Obtener todos los pisos
router.get('/', async (req, res) => {
  try {
    const floors = await Floor.find();
    res.status(200).json(floors);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pisos', error: error.message });
  }
});

// Crear un nuevo piso
router.post('/', async (req, res) => {
  try {
    const { name, svg, points, mapPosition } = req.body;

    // Verificar el tamaño del SVG
    if (svg && svg.length > 1024 * 1024 * 50) { // 50MB limit
      return res.status(413).json({ message: 'El archivo SVG es demasiado grande. El límite es de 50MB.' });
    }

    const newFloor = new Floor({ name, svg, points, mapPosition });
    await newFloor.save();
    res.status(201).json(newFloor);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el piso', error: error.message });
  }
});

// Actualizar puntos de un piso
// Actualizar un punto específico de un piso
router.patch('/:floorId/points/:pointId', async (req, res) => {
  const { floorId, pointId } = req.params;
  const { activo, vlan, switchIP } = req.body; // Datos que quieres actualizar

  try {
    // Encuentra el piso y actualiza el punto específico
    const floor = await Floor.findById(floorId);
    if (!floor) {
      return res.status(404).json({ message: 'Piso no encontrado' });
    }

    const pointIndex = floor.points.findIndex((point) => point._id.toString() === pointId);
    if (pointIndex === -1) {
      return res.status(404).json({ message: 'Punto no encontrado' });
    }

    // Actualiza los datos del punto
    if (activo !== undefined) floor.points[pointIndex].activo = activo;
    if (vlan !== undefined) floor.points[pointIndex].vlan = vlan;
    if (switchIP !== undefined) floor.points[pointIndex].switchIP = switchIP;

    // Guarda los cambios en la base de datos
    await floor.save();

    res.status(200).json(floor);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el punto', error: error.message });
  }
});


// Actualizar mapa SVG de un piso
router.put('/:id/svg', async (req, res) => {
  try {
    const { id } = req.params;
    const { svg, mapPosition } = req.body;

    // Verificar el tamaño del SVG
    if (svg && svg.length > 1024 * 1024 * 50) { // 50MB limit
      return res.status(413).json({ message: 'El archivo SVG es demasiado grande. El límite es de 50MB.' });
    }

    const updatedFloor = await Floor.findByIdAndUpdate(
      id,
      { svg, mapPosition },
      { new: true }
    );

    if (!updatedFloor) {
      return res.status(404).json({ message: 'Piso no encontrado' });
    }

    res.status(200).json(updatedFloor);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el mapa', error: error.message });
  }
});

// Eliminar un piso
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFloor = await Floor.findByIdAndDelete(id);

    if (!deletedFloor) {
      return res.status(404).json({ message: 'Piso no encontrado' });
    }

    res.status(200).json({ message: 'Piso eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el piso', error: error.message });
  }
});

// Obtener un piso específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const floor = await Floor.findById(id);

    if (!floor) {
      return res.status(404).json({ message: 'Piso no encontrado' });
    }

    res.status(200).json(floor);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el piso', error: error.message });
  }
});

// Actualizar un piso completo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, svg, points, mapPosition } = req.body;

    // Verificar el tamaño del SVG
    if (svg && svg.length > 1024 * 1024 * 50) { // 50MB limit
      return res.status(413).json({ message: 'El archivo SVG es demasiado grande. El límite es de 50MB.' });
    }

    const updatedFloor = await Floor.findByIdAndUpdate(
      id,
      { name, svg, points, mapPosition },
      { new: true }
    );

    if (!updatedFloor) {
      return res.status(404).json({ message: 'Piso no encontrado' });
    }

    res.status(200).json(updatedFloor);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el piso', error: error.message });
  }
});

router.get('/switch-info', async (req, res) => {
  try {
    const agent = req.query.agent || "10.172.0.250:161"; // Agente por defecto si no se especifica
    
    getInterfaceStatus(agent, (error, statuses) => {
      if (error) {
        return res.status(500).json({ message: 'Error al obtener los estados de las interfaces', error: error.message });
      }
      
      getVlanInfo(agent, (error, vlanInfo) => {
        if (error) {
          return res.status(500).json({ message: 'Error al obtener la información de VLAN', error: error.message });
        }
        
        const combinedData = statuses.map(status => {
          const vlan = vlanInfo.find(v => v.interface === status.interface);
          return {
            ...status,
            vlan: vlan ? vlan.vlan : null
          };
        });
        
        res.status(200).json(combinedData);
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// Sincronizar datos desde InfluxDB a MongoDB
router.post('/sync', async (req, res) => {
  try {
    await syncSwitchData(); // Llamar a la función de sincronización
    res.status(200).json({ message: 'Sincronización completada' });
  } catch (error) {
    res.status(500).json({ message: 'Error durante la sincronización', error: error.message });
  }
});


module.exports = router;

