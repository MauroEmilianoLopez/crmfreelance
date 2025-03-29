# CRM Freelance

[English](#english) | [Español](#español)

## English

### Description
CRM Freelance is a comprehensive Customer Relationship Management system designed specifically for freelancers. It helps manage clients, projects, and invoices in an efficient and organized way.

### Features
- 🔐 Secure authentication system
- 👥 Client management
- 📊 Project tracking
- 💰 Invoice generation and management
- 📈 Dashboard with key metrics
- 🔄 Real-time updates
- 📱 Responsive design

### Technologies Used
- Frontend:
  - HTML5
  - CSS3
  - JavaScript (Vanilla)
  - Bootstrap 5
  - Bootstrap Icons
- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/crm-freelance.git
cd crm-freelance
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

### API Documentation

#### Authentication Endpoints
- `POST /api/auth/registro` - Register a new user
- `POST /api/auth/login` - User login

#### Client Endpoints
- `GET /api/clientes` - Get all clients
- `POST /api/clientes` - Create new client
- `PUT /api/clientes/:id` - Update client
- `DELETE /api/clientes/:id` - Delete client

#### Project Endpoints
- `GET /api/proyectos` - Get all projects
- `POST /api/proyectos` - Create new project
- `PUT /api/proyectos/:id` - Update project
- `DELETE /api/proyectos/:id` - Delete project

#### Invoice Endpoints
- `GET /api/facturas` - Get all invoices
- `POST /api/facturas` - Create new invoice
- `PUT /api/facturas/:id` - Update invoice
- `DELETE /api/facturas/:id` - Delete invoice

---

## Español

### Descripción
CRM Freelance es un sistema integral de Gestión de Relaciones con Clientes diseñado específicamente para profesionales independientes. Ayuda a gestionar clientes, proyectos y facturas de manera eficiente y organizada.

### Características
- 🔐 Sistema de autenticación seguro
- 👥 Gestión de clientes
- 📊 Seguimiento de proyectos
- 💰 Generación y gestión de facturas
- 📈 Panel de control con métricas clave
- 🔄 Actualizaciones en tiempo real
- 📱 Diseño responsive

### Tecnologías Utilizadas
- Frontend:
  - HTML5
  - CSS3
  - JavaScript (Vanilla)
  - Bootstrap 5
  - Bootstrap Icons
- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Autenticación JWT

### Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/your-username/crm-freelance.git
cd crm-freelance
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear un archivo `.env` en el directorio raíz con las siguientes variables:
```env
PORT=3000
MONGODB_URI=tu_cadena_de_conexion_mongodb
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

### Documentación de la API

#### Endpoints de Autenticación
- `POST /api/auth/registro` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

#### Endpoints de Clientes
- `GET /api/clientes` - Obtener todos los clientes
- `POST /api/clientes` - Crear nuevo cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

#### Endpoints de Proyectos
- `GET /api/proyectos` - Obtener todos los proyectos
- `POST /api/proyectos` - Crear nuevo proyecto
- `PUT /api/proyectos/:id` - Actualizar proyecto
- `DELETE /api/proyectos/:id` - Eliminar proyecto

#### Endpoints de Facturas
- `GET /api/facturas` - Obtener todas las facturas
- `POST /api/facturas` - Crear nueva factura
- `PUT /api/facturas/:id` - Actualizar factura
- `DELETE /api/facturas/:id` - Eliminar factura 