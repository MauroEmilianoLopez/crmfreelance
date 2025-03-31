# CRM para Freelancers

Sistema de gestión de relaciones con clientes (CRM) diseñado específicamente para freelancers y profesionales independientes.

## Características

- 👤 Gestión de clientes
- 📊 Gestión de proyectos
- 💰 Facturación
- 🔐 Sistema de autenticación
- 📱 Diseño responsive
- 📈 Dashboard con métricas clave

## Requisitos

- Node.js (v14 o superior)
- MongoDB
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/crm-freelance.git
cd crm-freelance
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` en la raíz del proyecto:
```env
PORT=3000
MONGODB_URI=tu_url_de_mongodb
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

4. Iniciar el servidor:
```bash
npm run dev
```

## Estructura del Proyecto

```
├── public/             # Archivos estáticos
│   ├── css/           # Estilos
│   ├── js/            # JavaScript del cliente
│   └── *.html         # Páginas HTML
├── routes/            # Rutas de la API
├── models/            # Modelos de MongoDB
├── middleware/        # Middleware personalizado
├── server.js         # Punto de entrada
└── package.json      # Dependencias y scripts
```

## API Endpoints

### Autenticación
- `POST /api/auth/registro` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Clientes
- `GET /api/clientes` - Obtener todos los clientes
- `GET /api/clientes/:id` - Obtener un cliente específico
- `POST /api/clientes` - Crear nuevo cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Proyectos
- `GET /api/proyectos` - Obtener todos los proyectos
- `GET /api/proyectos/:id` - Obtener un proyecto específico
- `POST /api/proyectos` - Crear nuevo proyecto
- `PUT /api/proyectos/:id` - Actualizar proyecto
- `DELETE /api/proyectos/:id` - Eliminar proyecto

### Facturas
- `GET /api/facturas` - Obtener todas las facturas
- `GET /api/facturas/:id` - Obtener una factura específica
- `POST /api/facturas` - Crear nueva factura
- `PUT /api/facturas/:id` - Actualizar factura
- `DELETE /api/facturas/:id` - Eliminar factura

## Modelos de Datos

### Usuario
```javascript
{
    nombre: String,
    email: String,
    password: String,
    fechaCreacion: Date
}
```

### Cliente
```javascript
{
    nombre: String,
    email: String,
    telefono: String,
    empresa: String,
    direccion: String,
    estado: String,
    notas: String,
    creadoPor: ObjectId,
    fechaCreacion: Date
}
```

### Proyecto
```javascript
{
    nombre: String,
    descripcion: String,
    cliente: ObjectId,
    estado: String,
    fechaInicio: Date,
    fechaFin: Date,
    presupuesto: Number,
    notas: String,
    creadoPor: ObjectId,
    fechaCreacion: Date
}
```

### Factura
```javascript
{
    numero: String,
    cliente: ObjectId,
    proyecto: ObjectId,
    fecha: Date,
    fechaVencimiento: Date,
    items: [{
        descripcion: String,
        cantidad: Number,
        precioUnitario: Number
    }],
    subtotal: Number,
    impuestos: Number,
    total: Number,
    estado: String,
    notas: String,
    creadoPor: ObjectId,
    fechaCreacion: Date
}
```

## Seguridad

- Autenticación mediante JWT (JSON Web Tokens)
- Middleware de autenticación para proteger rutas
- Encriptación de contraseñas con bcrypt
- Validación de datos en el servidor
- Protección contra XSS y CSRF
- Sanitización de entradas de usuario

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm start` - Inicia el servidor en modo producción
- `npm test` - Ejecuta las pruebas (si están configuradas)

## Contribución

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles. 