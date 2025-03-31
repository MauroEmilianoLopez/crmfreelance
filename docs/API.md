# Documentación de la API del CRM

## Autenticación

Todas las rutas protegidas requieren un token JWT en el encabezado de la solicitud:
```
Authorization: Bearer <token>
```

### Registro de Usuario
```http
POST /api/auth/registro
Content-Type: application/json

{
    "nombre": "string",
    "email": "string",
    "password": "string"
}
```

Respuesta exitosa (200):
```json
{
    "mensaje": "Usuario registrado exitosamente",
    "usuario": {
        "_id": "string",
        "nombre": "string",
        "email": "string",
        "fechaCreacion": "date"
    }
}
```

### Inicio de Sesión
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "string",
    "password": "string"
}
```

Respuesta exitosa (200):
```json
{
    "token": "string",
    "usuario": {
        "_id": "string",
        "nombre": "string",
        "email": "string"
    }
}
```

## Clientes

### Obtener Todos los Clientes
```http
GET /api/clientes
Authorization: Bearer <token>
```

Respuesta exitosa (200):
```json
[
    {
        "_id": "string",
        "nombre": "string",
        "email": "string",
        "telefono": "string",
        "empresa": "string",
        "direccion": "string",
        "estado": "string",
        "notas": "string",
        "creadoPor": "string",
        "fechaCreacion": "date"
    }
]
```

### Obtener un Cliente Específico
```http
GET /api/clientes/:id
Authorization: Bearer <token>
```

Respuesta exitosa (200):
```json
{
    "_id": "string",
    "nombre": "string",
    "email": "string",
    "telefono": "string",
    "empresa": "string",
    "direccion": "string",
    "estado": "string",
    "notas": "string",
    "creadoPor": "string",
    "fechaCreacion": "date"
}
```

### Crear Nuevo Cliente
```http
POST /api/clientes
Authorization: Bearer <token>
Content-Type: application/json

{
    "nombre": "string",
    "email": "string",
    "telefono": "string",
    "empresa": "string",
    "direccion": "string",
    "estado": "string",
    "notas": "string"
}
```

### Actualizar Cliente
```http
PUT /api/clientes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "nombre": "string",
    "email": "string",
    "telefono": "string",
    "empresa": "string",
    "direccion": "string",
    "estado": "string",
    "notas": "string"
}
```

### Eliminar Cliente
```http
DELETE /api/clientes/:id
Authorization: Bearer <token>
```

## Proyectos

### Obtener Todos los Proyectos
```http
GET /api/proyectos
Authorization: Bearer <token>
```

Respuesta exitosa (200):
```json
[
    {
        "_id": "string",
        "nombre": "string",
        "descripcion": "string",
        "cliente": {
            "_id": "string",
            "nombre": "string"
        },
        "estado": "string",
        "fechaInicio": "date",
        "fechaFin": "date",
        "presupuesto": "number",
        "notas": "string",
        "creadoPor": "string",
        "fechaCreacion": "date"
    }
]
```

### Obtener un Proyecto Específico
```http
GET /api/proyectos/:id
Authorization: Bearer <token>
```

### Crear Nuevo Proyecto
```http
POST /api/proyectos
Authorization: Bearer <token>
Content-Type: application/json

{
    "nombre": "string",
    "descripcion": "string",
    "cliente": "string (ID)",
    "estado": "string",
    "fechaInicio": "date",
    "fechaFin": "date",
    "presupuesto": "number",
    "notas": "string"
}
```

### Actualizar Proyecto
```http
PUT /api/proyectos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "nombre": "string",
    "descripcion": "string",
    "cliente": "string (ID)",
    "estado": "string",
    "fechaInicio": "date",
    "fechaFin": "date",
    "presupuesto": "number",
    "notas": "string"
}
```

### Eliminar Proyecto
```http
DELETE /api/proyectos/:id
Authorization: Bearer <token>
```

## Facturas

### Obtener Todas las Facturas
```http
GET /api/facturas
Authorization: Bearer <token>
```

Respuesta exitosa (200):
```json
[
    {
        "_id": "string",
        "numero": "string",
        "cliente": {
            "_id": "string",
            "nombre": "string"
        },
        "proyecto": {
            "_id": "string",
            "nombre": "string"
        },
        "fecha": "date",
        "fechaVencimiento": "date",
        "items": [
            {
                "descripcion": "string",
                "cantidad": "number",
                "precioUnitario": "number"
            }
        ],
        "subtotal": "number",
        "impuestos": "number",
        "total": "number",
        "estado": "string",
        "notas": "string",
        "creadoPor": "string",
        "fechaCreacion": "date"
    }
]
```

### Obtener una Factura Específica
```http
GET /api/facturas/:id
Authorization: Bearer <token>
```

### Crear Nueva Factura
```http
POST /api/facturas
Authorization: Bearer <token>
Content-Type: application/json

{
    "cliente": "string (ID)",
    "proyecto": "string (ID)",
    "fecha": "date",
    "fechaVencimiento": "date",
    "items": [
        {
            "descripcion": "string",
            "cantidad": "number",
            "precioUnitario": "number"
        }
    ],
    "impuestos": "number",
    "notas": "string"
}
```

### Actualizar Factura
```http
PUT /api/facturas/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "cliente": "string (ID)",
    "proyecto": "string (ID)",
    "fecha": "date",
    "fechaVencimiento": "date",
    "items": [
        {
            "descripcion": "string",
            "cantidad": "number",
            "precioUnitario": "number"
        }
    ],
    "impuestos": "number",
    "estado": "string",
    "notas": "string"
}
```

### Eliminar Factura
```http
DELETE /api/facturas/:id
Authorization: Bearer <token>
```

## Códigos de Estado

- `200` - Éxito
- `201` - Creado exitosamente
- `400` - Error en la solicitud
- `401` - No autorizado
- `404` - No encontrado
- `500` - Error interno del servidor

## Manejo de Errores

Todas las respuestas de error siguen este formato:
```json
{
    "mensaje": "string",
    "error": "string (opcional)"
}
```

## Paginación

Para endpoints que devuelven listas, se puede usar paginación con los siguientes parámetros:

```http
GET /api/[recurso]?page=1&limit=10
```

Respuesta con paginación:
```json
{
    "data": [],
    "total": "number",
    "pagina": "number",
    "totalPaginas": "number"
}
```

## Filtros

Los endpoints que devuelven listas admiten filtros mediante parámetros de consulta:

```http
GET /api/clientes?estado=activo
GET /api/proyectos?cliente=id&estado=en_progreso
GET /api/facturas?estado=pendiente&fechaInicio=2024-01-01&fechaFin=2024-12-31
```

## Ordenamiento

Se puede ordenar los resultados usando los parámetros `sort` y `order`:

```http
GET /api/[recurso]?sort=fechaCreacion&order=desc
``` 