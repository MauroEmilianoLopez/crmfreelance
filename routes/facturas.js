const express = require('express');
const router = express.Router();
const Factura = require('../models/Factura');
const auth = require('../middleware/auth');

// Obtener todas las facturas
router.get('/', auth, async (req, res) => {
    try {
        const facturas = await Factura.find({ creadoPor: req.usuario._id })
            .populate('cliente', 'nombre')
            .populate('proyecto', 'nombre')
            .sort({ fechaCreacion: -1 });
        res.json(facturas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener facturas', error: error.message });
    }
});

// Obtener una factura específica
router.get('/:id', auth, async (req, res) => {
    try {
        const factura = await Factura.findOne({
            _id: req.params.id,
            creadoPor: req.usuario._id
        })
        .populate('cliente', 'nombre')
        .populate('proyecto', 'nombre');
        
        if (!factura) {
            return res.status(404).json({ mensaje: 'Factura no encontrada' });
        }
        
        res.json(factura);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener factura', error: error.message });
    }
});

// Crear una nueva factura
router.post('/', auth, async (req, res) => {
    try {
        // Generar número de factura único
        const ultimaFactura = await Factura.findOne({ creadoPor: req.usuario._id })
            .sort({ fechaCreacion: -1 });
        
        let numeroFactura = 1;
        if (ultimaFactura) {
            numeroFactura = parseInt(ultimaFactura.numero.split('-')[1]) + 1;
        }
        
        const factura = new Factura({
            ...req.body,
            numero: `FAC-${numeroFactura.toString().padStart(6, '0')}`,
            creadoPor: req.usuario._id
        });
        
        await factura.save();
        res.status(201).json(factura);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear factura', error: error.message });
    }
});

// Actualizar una factura
router.put('/:id', auth, async (req, res) => {
    try {
        const factura = await Factura.findOneAndUpdate(
            { _id: req.params.id, creadoPor: req.usuario._id },
            req.body,
            { new: true, runValidators: true }
        )
        .populate('cliente', 'nombre')
        .populate('proyecto', 'nombre');
        
        if (!factura) {
            return res.status(404).json({ mensaje: 'Factura no encontrada' });
        }
        
        res.json(factura);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar factura', error: error.message });
    }
});

// Eliminar una factura
router.delete('/:id', auth, async (req, res) => {
    try {
        const factura = await Factura.findOneAndDelete({
            _id: req.params.id,
            creadoPor: req.usuario._id
        });
        
        if (!factura) {
            return res.status(404).json({ mensaje: 'Factura no encontrada' });
        }
        
        res.json({ mensaje: 'Factura eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar factura', error: error.message });
    }
});

module.exports = router; 