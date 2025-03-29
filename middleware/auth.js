const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const auth = async (req, res, next) => {
    try {
        console.log('Iniciando verificación de autenticación...');
        
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Token recibido:', token ? 'Presente' : 'No presente');
        
        if (!token) {
            console.log('No se encontró token');
            return res.status(401).json({ mensaje: 'No autorizado - Token no proporcionado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded);

        const usuario = await Usuario.findById(decoded.id);
        console.log('Usuario encontrado:', usuario ? 'Sí' : 'No');

        if (!usuario) {
            console.log('Usuario no encontrado');
            return res.status(401).json({ mensaje: 'No autorizado - Usuario no encontrado' });
        }

        req.usuario = usuario;
        req.token = token;
        console.log('Autenticación exitosa');
        next();
    } catch (error) {
        console.error('Error en autenticación:', error);
        res.status(401).json({ mensaje: 'No autorizado - Token inválido' });
    }
};

module.exports = auth; 