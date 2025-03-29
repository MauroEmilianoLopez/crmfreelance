# CRM Freelance - Documentación Técnica / Technical Documentation

[English](#english) | [Español](#español)

## English

### System Architecture

#### Frontend Architecture
The frontend is built using vanilla JavaScript with a modular approach:
- `public/js/auth.js` - Authentication management
- `public/js/main.js` - Dashboard and general functionality
- `public/js/clientes.js` - Client management
- `public/js/proyectos.js` - Project management
- `public/js/facturas.js` - Invoice management

#### Backend Architecture
The backend follows the MVC pattern:
- Models: MongoDB schemas
- Controllers: Business logic
- Routes: API endpoints
- Middleware: Authentication and validation

### API Details

#### Authentication

##### Register User
```http
POST /api/auth/registro
Content-Type: application/json

{
    "nombre": "string",
    "email": "string",
    "password": "string"
}
```

##### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "string",
    "password": "string"
}
```

#### Clients

##### Create Client
```http
POST /api/clientes
Authorization: Bearer {token}
Content-Type: application/json

{
    "nombre": "string",
    "email": "string",
    "telefono": "string",
    "empresa": "string"
}
```

##### Update Client
```http
PUT /api/clientes/:id
Authorization: Bearer {token}
Content-Type: application/json

{
    "nombre": "string",
    "email": "string",
    "telefono": "string",
    "empresa": "string"
}
```

#### Projects

##### Create Project
```http
POST /api/proyectos
Authorization: Bearer {token}
Content-Type: application/json

{
    "nombre": "string",
    "descripcion": "string",
    "cliente": "string (client_id)",
    "fechaInicio": "date",
    "fechaFin": "date",
    "estado": "string",
    "presupuesto": "number"
}
```

##### Update Project
```http
PUT /api/proyectos/:id
Authorization: Bearer {token}
Content-Type: application/json

{
    "nombre": "string",
    "descripcion": "string",
    "cliente": "string (client_id)",
    "fechaInicio": "date",
    "fechaFin": "date",
    "estado": "string",
    "presupuesto": "number"
}
```

#### Invoices

##### Create Invoice
```http
POST /api/facturas
Authorization: Bearer {token}
Content-Type: application/json

{
    "cliente": "string (client_id)",
    "proyecto": "string (project_id)",
    "fecha": "date",
    "fechaVencimiento": "date",
    "items": [{
        "descripcion": "string",
        "cantidad": "number",
        "precioUnitario": "number",
        "subtotal": "number"
    }],
    "subtotal": "number",
    "impuestos": "number",
    "total": "number",
    "estado": "string"
}
```

##### Update Invoice
```http
PUT /api/facturas/:id
Authorization: Bearer {token}
Content-Type: application/json

{
    "cliente": "string (client_id)",
    "proyecto": "string (project_id)",
    "fecha": "date",
    "fechaVencimiento": "date",
    "items": [{
        "descripcion": "string",
        "cantidad": "number",
        "precioUnitario": "number",
        "subtotal": "number"
    }],
    "subtotal": "number",
    "impuestos": "number",
    "total": "number",
    "estado": "string"
}
```

### Security Considerations
- JWT token-based authentication
- Password hashing using bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- Environment variables for sensitive data

### Database Schema

#### User Schema
```javascript
{
    nombre: String,
    email: String,
    password: String,
    createdAt: Date
}
```

#### Client Schema
```javascript
{
    nombre: String,
    email: String,
    telefono: String,
    empresa: String,
    createdAt: Date,
    usuario: ObjectId
}
```

#### Project Schema
```javascript
{
    nombre: String,
    descripcion: String,
    cliente: ObjectId,
    fechaInicio: Date,
    fechaFin: Date,
    estado: String,
    presupuesto: Number,
    createdAt: Date,
    usuario: ObjectId
}
```

#### Invoice Schema
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
        precioUnitario: Number,
        subtotal: Number
    }],
    subtotal: Number,
    impuestos: Number,
    total: Number,
    estado: String,
    createdAt: Date,
    usuario: ObjectId
}
```

---

## Español

### Arquitectura del Sistema

#### Arquitectura Frontend
El frontend está construido usando JavaScript vanilla con un enfoque modular:
- `public/js/auth.js` - Gestión de autenticación
- `public/js/main.js` - Dashboard y funcionalidad general
- `public/js/clientes.js` - Gestión de clientes
- `public/js/proyectos.js` - Gestión de proyectos
- `public/js/facturas.js` - Gestión de facturas

#### Arquitectura Backend
El backend sigue el patrón MVC:
- Modelos: Esquemas de MongoDB
- Controladores: Lógica de negocio
- Rutas: Endpoints de la API
- Middleware: Autenticación y validación

### Detalles de la API

#### Autenticación

##### Registrar Usuario
```http
POST /api/auth/registro
Content-Type: application/json

{
    "nombre": "string",
    "email": "string",
    "password": "string"
}
```

##### Iniciar Sesión
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "string",
    "password": "string"
}
```

#### Clientes

##### Crear Cliente
```http
POST /api/clientes
Authorization: Bearer {token}
Content-Type: application/json

{
    "nombre": "string",
    "email": "string",
    "telefono": "string",
    "empresa": "string"
}
```

##### Actualizar Cliente
```http
PUT /api/clientes/:id
Authorization: Bearer {token}
Content-Type: application/json

{
    "nombre": "string",
    "email": "string",
    "telefono": "string",
    "empresa": "string"
}
```

#### Proyectos

##### Crear Proyecto
```http
POST /api/proyectos
Authorization: Bearer {token}
Content-Type: application/json

{
    "nombre": "string",
    "descripcion": "string",
    "cliente": "string (client_id)",
    "fechaInicio": "date",
    "fechaFin": "date",
    "estado": "string",
    "presupuesto": "number"
}
```

##### Actualizar Proyecto
```http
PUT /api/proyectos/:id
Authorization: Bearer {token}
Content-Type: application/json

{
    "nombre": "string",
    "descripcion": "string",
    "cliente": "string (client_id)",
    "fechaInicio": "date",
    "fechaFin": "date",
    "estado": "string",
    "presupuesto": "number"
}
```

#### Facturas

##### Crear Factura
```http
POST /api/facturas
Authorization: Bearer {token}
Content-Type: application/json

{
    "cliente": "string (client_id)",
    "proyecto": "string (project_id)",
    "fecha": "date",
    "fechaVencimiento": "date",
    "items": [{
        "descripcion": "string",
        "cantidad": "number",
        "precioUnitario": "number",
        "subtotal": "number"
    }],
    "subtotal": "number",
    "impuestos": "number",
    "total": "number",
    "estado": "string"
}
```

##### Actualizar Factura
```http
PUT /api/facturas/:id
Authorization: Bearer {token}
Content-Type: application/json

{
    "cliente": "string (client_id)",
    "proyecto": "string (project_id)",
    "fecha": "date",
    "fechaVencimiento": "date",
    "items": [{
        "descripcion": "string",
        "cantidad": "number",
        "precioUnitario": "number",
        "subtotal": "number"
    }],
    "subtotal": "number",
    "impuestos": "number",
    "total": "number",
    "estado": "string"
}
```

### Consideraciones de Seguridad
- Autenticación basada en tokens JWT
- Encriptación de contraseñas usando bcrypt
- Validación y sanitización de entradas
- Protección CORS
- Limitación de tasa de peticiones
- Variables de entorno para datos sensibles

### Esquema de Base de Datos

#### Esquema de Usuario
```javascript
{
    nombre: String,
    email: String,
    password: String,
    createdAt: Date
}
```

#### Esquema de Cliente
```javascript
{
    nombre: String,
    email: String,
    telefono: String,
    empresa: String,
    createdAt: Date,
    usuario: ObjectId
}
```

#### Esquema de Proyecto
```javascript
{
    nombre: String,
    descripcion: String,
    cliente: ObjectId,
    fechaInicio: Date,
    fechaFin: Date,
    estado: String,
    presupuesto: Number,
    createdAt: Date,
    usuario: ObjectId
}
```

#### Esquema de Factura
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
        precioUnitario: Number,
        subtotal: Number
    }],
    subtotal: Number,
    impuestos: Number,
    total: Number,
    estado: String,
    createdAt: Date,
    usuario: ObjectId
}
``` 