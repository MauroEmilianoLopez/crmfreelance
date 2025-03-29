const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'en_progreso', 'completado', 'cancelado'],
        default: 'pendiente'
    },
    fechaInicio: {
        type: Date,
        default: Date.now
    },
    fechaEntrega: {
        type: Date
    },
    presupuesto: {
        type: Number,
        required: true
    },
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Proyecto', proyectoSchema); 