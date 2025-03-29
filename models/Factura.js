const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
    numero: {
        type: String,
        required: true,
        unique: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto'
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    fechaVencimiento: {
        type: Date,
        required: true
    },
    items: [{
        descripcion: {
            type: String,
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        },
        precioUnitario: {
            type: Number,
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        }
    }],
    subtotal: {
        type: Number,
        required: true
    },
    impuestos: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'pagada', 'vencida', 'cancelada'],
        default: 'pendiente'
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

module.exports = mongoose.model('Factura', facturaSchema); 