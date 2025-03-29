const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
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

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => {
    console.error('Error conectando a MongoDB:', err);
    process.exit(1);
});

// Rutas de la API
app.use('/api', dashboardRoutes);
app.use('/api', authRoutes);
app.use('/api', clientesRoutes);
app.use('/api', proyectosRoutes);
app.use('/api', facturasRoutes);

// Rutas de las páginas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registro.html'));
});

app.get('/clientes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'clientes.html'));
});

app.get('/proyectos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'proyectos.html'));
});

app.get('/facturas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'facturas.html'));
});

// Manejo de rutas no encontradas - debe estar al final
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ mensaje: 'API endpoint no encontrado' });
    } else {
        res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 