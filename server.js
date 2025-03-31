const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');
const clientesRoutes = require('./routes/clientes');
const proyectosRoutes = require('./routes/proyectos');
const facturasRoutes = require('./routes/facturas');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Logging middleware
app.use(morgan('dev'));
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ Conectado a MongoDB');
    console.log('📦 Base de datos:', process.env.MONGODB_URI.split('/').pop());
})
.catch(err => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
});

// Rutas de la API
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/facturas', facturasRoutes);

// Rutas de las páginas
const pages = {
    '/': 'index.html',
    '/login': 'login.html',
    '/login.html': 'login.html',
    '/registro': 'registro.html',
    '/registro.html': 'registro.html',
    '/clientes': 'clientes.html',
    '/clientes.html': 'clientes.html',
    '/proyectos': 'proyectos.html',
    '/proyectos.html': 'proyectos.html',
    '/facturas': 'facturas.html',
    '/facturas.html': 'facturas.html'
};

// Manejar todas las rutas de páginas
Object.entries(pages).forEach(([route, file]) => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', file));
    });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Manejo de rutas no encontradas - debe estar al final
app.use((req, res) => {
    console.log(`⚠️ Ruta no encontrada: ${req.method} ${req.url}`);
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ 
            error: 'No encontrado',
            mensaje: 'API endpoint no encontrado' 
        });
    } else {
        res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🚀 Servidor iniciado');
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
}); 