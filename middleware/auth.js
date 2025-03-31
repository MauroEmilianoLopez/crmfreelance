const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const auth = async (req, res, next) => {
    try {
        console.log('Iniciando verificación de autenticación...');
        console.log('Headers recibidos:', req.headers);
        
        // Obtener el token del header Authorization
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            console.log('No se encontró header de autorización');
            return res.status(401).json({ mensaje: 'No autorizado - Token no proporcionado' });
        }

        // Verificar que el token tenga el formato correcto
        if (!authHeader.startsWith('Bearer ')) {
            console.log('Formato de token incorrecto');
            return res.status(401).json({ mensaje: 'No autorizado - Formato de token inválido' });
        }

        // Extraer el token
        const token = authHeader.replace('Bearer ', '');
        console.log('Token extraído:', token.substring(0, 20) + '...');

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado:', { id: decoded.id, exp: decoded.exp });

        // Buscar el usuario
        const usuario = await Usuario.findById(decoded.id).select('-password');
        console.log('Usuario encontrado:', usuario ? usuario._id : 'No');

        if (!usuario) {
            console.log('Usuario no encontrado en la base de datos');
            return res.status(401).json({ mensaje: 'No autorizado - Usuario no encontrado' });
        }

        // Verificar si el token está por expirar (menos de 1 hora)
        const ahora = Math.floor(Date.now() / 1000);
        const tiempoRestante = decoded.exp - ahora;
        console.log('Tiempo restante del token:', tiempoRestante, 'segundos');

        if (tiempoRestante < 3600) { // Menos de 1 hora
            console.log('Token próximo a expirar, generando nuevo token');
            const nuevoToken = jwt.sign(
                { id: usuario._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );
            res.setHeader('New-Token', nuevoToken);
        }

        // Agregar usuario y token a la request
        req.usuario = usuario;
        req.token = token;
        console.log('Autenticación exitosa para usuario:', usuario._id);
        next();
    } catch (error) {
        console.error('Error en autenticación:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ mensaje: 'No autorizado - Token inválido' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ mensaje: 'No autorizado - Token expirado' });
        }
        res.status(401).json({ mensaje: 'No autorizado - Error de autenticación' });
    }
};

module.exports = auth; 