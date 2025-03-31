# Documentación Técnica del CRM

## Arquitectura del Sistema

### Frontend
- HTML5 para la estructura
- CSS3 con Bootstrap 5 para el diseño
- JavaScript vanilla para la lógica del cliente
- Bootstrap Icons para iconografía
- Diseño responsive mobile-first

### Backend
- Node.js con Express.js
- MongoDB como base de datos
- JWT para autenticación
- Bcrypt para encriptación
- Morgan para logging
- CORS para seguridad
- Dotenv para configuración

## Estructura de Directorios

```
├── docs/                 # Documentación
├── middleware/          # Middleware personalizado
│   ├── auth.js         # Autenticación JWT
│   └── error.js        # Manejo de errores
├── models/             # Modelos de MongoDB
│   ├── Usuario.js
│   ├── Cliente.js
│   ├── Proyecto.js
│   └── Factura.js
├── public/             # Archivos estáticos
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── clientes.js
│   │   ├── proyectos.js
│   │   └── facturas.js
│   └── *.html
├── routes/             # Rutas de la API
│   ├── auth.js
│   ├── clientes.js
│   ├── proyectos.js
│   └── facturas.js
├── .env               # Variables de entorno
├── .gitignore
├── package.json
├── README.md
└── server.js         # Punto de entrada
```

## Modelos de Base de Datos

### Usuario
```javascript
{
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
}
```

### Cliente
```javascript
{
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
    telefono: String,
    empresa: String,
    direccion: String,
    estado: {
        type: String,
        enum: ['activo', 'inactivo', 'prospecto'],
        default: 'prospecto'
    },
    notas: String,
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
}
```

### Proyecto
```javascript
{
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: String,
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
    fechaInicio: Date,
    fechaFin: Date,
    presupuesto: {
        type: Number,
        min: 0
    },
    notas: String,
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
}
```

### Factura
```javascript
{
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
        required: true
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
            required: true,
            min: 1
        },
        precioUnitario: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    impuestos: {
        type: Number,
        required: true,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    estado: {
        type: String,
        enum: ['pendiente', 'pagada', 'vencida', 'cancelada'],
        default: 'pendiente'
    },
    notas: String,
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
}
```

## Middleware

### Autenticación (auth.js)
```javascript
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ mensaje: 'No autorizado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findById(decoded.id);
        
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Usuario no encontrado' });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token inválido' });
    }
};
```

## Seguridad

### Autenticación
- JWT para tokens de acceso
- Bcrypt para hash de contraseñas
- Tokens con expiración configurable
- Middleware de autenticación en rutas protegidas

### Validación de Datos
- Validación de esquemas con Mongoose
- Sanitización de entradas
- Validación de tipos de datos
- Manejo de errores personalizado

### Protección contra Ataques
- CORS configurado
- Headers de seguridad
- Rate limiting
- Sanitización de entrada de usuario
- Protección XSS
- Protección CSRF

## Manejo de Errores

### Middleware de Error Global
```javascript
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        mensaje: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
```

### Errores Personalizados
```javascript
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
```

## Configuración

### Variables de Entorno (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/crm
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

### Configuración de Express
```javascript
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));
```

## Scripts NPM

```json
{
    "scripts": {
        "start": "node server.js",
        "dev": "nodemon server.js",
        "test": "jest"
    }
}
```

## Dependencias Principales

```json
{
    "dependencies": {
        "bcryptjs": "^2.4.3",
        "cors": "^2.8.5",
        "dotenv": "^16.0.0",
        "express": "^4.17.1",
        "jsonwebtoken": "^8.5.1",
        "mongoose": "^6.0.12",
        "morgan": "^1.10.0"
    },
    "devDependencies": {
        "nodemon": "^2.0.15",
        "jest": "^27.4.7"
    }
}
```

## Despliegue

### Requisitos del Servidor
- Node.js v14 o superior
- MongoDB v4.4 o superior
- 1GB RAM mínimo
- 10GB espacio en disco

### Pasos de Despliegue
1. Clonar repositorio
2. Instalar dependencias
3. Configurar variables de entorno
4. Construir la aplicación
5. Iniciar el servidor

### Monitoreo
- Morgan para logging de solicitudes HTTP
- Console.log para debugging en desarrollo
- Manejo de errores centralizado
- Logs de MongoDB

## Mantenimiento

### Backups
- Backup diario de la base de datos
- Rotación de logs
- Backup de archivos de configuración

### Actualizaciones
- Actualización de dependencias
- Parches de seguridad
- Mejoras de rendimiento
- Nuevas características

## Rendimiento

### Optimizaciones
- Caché de consultas frecuentes
- Índices en MongoDB
- Compresión de respuestas
- Minificación de assets estáticos

### Escalabilidad
- Diseño modular
- Separación de preocupaciones
- Preparado para contenedores
- Configuración flexible 