const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    telefono: {
        type: String,
        trim: true
    },
    empresa: {
        type: String,
        trim: true
    },
    direccion: {
        calle: String,
        ciudad: String,
        pais: String,
        codigoPostal: String
    },
    estado: {
        type: String,
        enum: ['activo', 'inactivo', 'prospecto'],
        default: 'prospecto'
    },
    notas: {
        type: String,
        trim: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    ultimaActualizacion: {
        type: Date,
        default: Date.now
    },
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

// Actualizar fecha de última actualización antes de guardar
clienteSchema.pre('save', function(next) {
    this.ultimaActualizacion = new Date();
    next();
});

module.exports = mongoose.model('Cliente', clienteSchema); 