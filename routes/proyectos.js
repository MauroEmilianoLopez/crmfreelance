const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');
const auth = require('../middleware/auth');

// Obtener todos los proyectos
router.get('/', auth, async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creadoPor: req.usuario._id })
            .populate('cliente', 'nombre')
            .sort({ fechaCreacion: -1 });
        res.json(proyectos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener proyectos', error: error.message });
    }
});

// Obtener un proyecto específico
router.get('/:id', auth, async (req, res) => {
    try {
        const proyecto = await Proyecto.findOne({
            _id: req.params.id,
            creadoPor: req.usuario._id
        }).populate('cliente', 'nombre');
        
        if (!proyecto) {
            return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        }
        
        res.json(proyecto);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener proyecto', error: error.message });
    }
});

// Crear un nuevo proyecto
router.post('/', auth, async (req, res) => {
    try {
        const proyecto = new Proyecto({
            ...req.body,
            creadoPor: req.usuario._id
        });
        
        await proyecto.save();
        res.status(201).json(proyecto);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear proyecto', error: error.message });
    }
});

// Actualizar un proyecto
router.put('/:id', auth, async (req, res) => {
    try {
        const proyecto = await Proyecto.findOneAndUpdate(
            { _id: req.params.id, creadoPor: req.usuario._id },
            req.body,
            { new: true, runValidators: true }
        ).populate('cliente', 'nombre');
        
        if (!proyecto) {
            return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        }
        
        res.json(proyecto);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar proyecto', error: error.message });
    }
});

// Eliminar un proyecto
router.delete('/:id', auth, async (req, res) => {
    try {
        const proyecto = await Proyecto.findOneAndDelete({
            _id: req.params.id,
            creadoPor: req.usuario._id
        });
        
        if (!proyecto) {
            return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        }
        
        res.json({ mensaje: 'Proyecto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar proyecto', error: error.message });
    }
});

module.exports = router; 