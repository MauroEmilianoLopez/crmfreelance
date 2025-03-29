const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Ruta para obtener datos del dashboard
router.get('/dashboard', auth, (req, res) => {
    // Por ahora, devolvemos datos de ejemplo
    res.json({
        clientesActivos: 0,
        proyectosActivos: 0,
        facturasPendientes: 0,
        ingresosMensuales: 0
    });
});

module.exports = router; 