const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const auth = require('../middleware/auth');

// Obtener todos los clientes
router.get('/clientes', auth, async (req, res) => {
    try {
        const clientes = await Cliente.find({ creadoPor: req.usuario._id })
            .sort({ fechaCreacion: -1 });
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener clientes', error: error.message });
    }
});

// Obtener un cliente específico
router.get('/clientes/:id', auth, async (req, res) => {
    try {
        const cliente = await Cliente.findOne({
            _id: req.params.id,
            creadoPor: req.usuario._id
        });
        
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener cliente', error: error.message });
    }
});

// Crear un nuevo cliente
router.post('/clientes', auth, async (req, res) => {
    try {
        const cliente = new Cliente({
            ...req.body,
            creadoPor: req.usuario._id
        });
        
        await cliente.save();
        res.status(201).json(cliente);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear cliente', error: error.message });
    }
});

// Actualizar un cliente
router.put('/clientes/:id', auth, async (req, res) => {
    try {
        const cliente = await Cliente.findOneAndUpdate(
            { _id: req.params.id, creadoPor: req.usuario._id },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        
        res.json(cliente);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar cliente', error: error.message });
    }
});

// Eliminar un cliente
router.delete('/clientes/:id', auth, async (req, res) => {
    try {
        const cliente = await Cliente.findOneAndDelete({
            _id: req.params.id,
            creadoPor: req.usuario._id
        });
        
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        
        res.json({ mensaje: 'Cliente eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar cliente', error: error.message });
    }
});

module.exports = router; 