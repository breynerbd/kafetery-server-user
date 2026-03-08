# 🍽️ Kafetery Server - User Service

Backend API para la gestión de usuarios dentro del sistema Kafetery.
Este servicio permite consultar menús, crear órdenes, manejar reservas, obtener promociones y consultar puntos de usuarios.

El proyecto está construido con Node.js, Express y MongoDB, siguiendo una arquitectura modular por dominios.

## 🚀 Tecnologías Utilizadas

Node.js – Entorno de ejecución del servidor

Express.js – Framework para crear la API REST

MongoDB – Base de datos NoSQL

Mongoose – Modelado de datos para MongoDB

dotenv – Manejo de variables de entorno

## 📁 Estructura del Proyecto

```
kafeteria-server-user
│
├── configs
├── middlewares
│
├── src
│   ├── menus
│   │   ├── menu.model.js
│   │   └── menu.router.js
│   │
│   ├── orders
│   │   ├── order.model.js
│   │   └── order.router.js
│   │
│   ├── promotions
│   │   ├── promotion.model.js
│   │   └── promotion.router.js
│   │
│   ├── reservations
│   │   ├── reservation.model.js
│   │   └── reservation.router.js
│   │
│   ├── restaurants
│   │   ├── restaurant.model.js
│   │   └── restaurant.router.js
│   │
│   ├── tables
│   │   ├── table.model.js
│   │   └── table.router.js
│   │
│   ├── users
│   │   ├── user.model.js
│   │   └── user.router.js
│
├── utils
│
├── .env
├── index.js
├── package.json
└── README.md
```

## ⚙️ Instalación

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-repositorio/kafetery-server-user.git
cd kafetery-server-user
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar variables de entorno

Crear un archivo `.env`

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/kafetery
```

### 4️⃣ Ejecutar el servidor

```bash
npm run dev
```

o

```bash
node index.js
```

## 📡 Endpoints de la API

### 🍔 Menus

#### Obtener todos los menús activos

```
GET /menus
```

Respuesta:

```json
{
  "success": true,
  "data": []
}
```

#### Obtener los 5 menús más vendidos

```
GET /menus/top
```

Ordenados por `salesCount`.

---

### 🧾 Orders

#### Obtener órdenes

```
GET /orders
```

Filtros disponibles:

```
?userId=
?restaurantId=
?status=
```

#### Crear orden

```
POST /orders
```

Body:

```json
{
  "user": "userId",
  "restaurant": "restaurantId",
  "items": [
    {
      "menu": "menuId",
      "quantity": 2
    }
  ],
  "isDineIn": true
}
```

Funciones automáticas:

- Validación de horario del restaurante
- Reducción de stock
- Cálculo de subtotal
- Aplicación de promociones
- Asignación automática de mesa
- Cálculo de tiempo estimado

#### Actualizar estado de orden

```
PATCH /orders/:id/status
```

Body:

```json
{
  "status": "PREPARING"
}
```

Transiciones válidas:

```
pending → CONFIRMED | CANCELLED
confirmed → PREPARING | CANCELLED
preparing → READY
ready → DELIVERING
delivered → final
cancelled → final
```

Cuando una orden se entrega:

- La mesa se libera
- El usuario recibe puntos de fidelidad

---

### 🎟️ Promociones

#### Obtener promociones activas

```
GET /promotions
```

Las promociones pueden aplicar descuentos porcentuales a las órdenes.

---

### 📅 Reservaciones

#### Crear reservación

```
POST /reservations
```

Body:

```json
{
  "table": "tableId",
  "date": "2026-03-10",
  "startTime": "18:00",
  "endTime": "20:00",
  "people": 4
}
```

Validaciones:

- Capacidad de mesa
- Conflicto de horarios
- Existencia de mesa

#### Obtener reservaciones

```
GET /reservations
```

---

### 🏪 Restaurantes

#### Obtener restaurantes activos

```
GET /restaurants
```

---

### 🪑 Mesas

#### Obtener mesas

```
GET /tables
```

Filtro opcional:

```
?restaurantId=
```

---

### 👤 Usuarios

#### Obtener puntos de usuario

```
GET /users/points/:userId
```

Respuesta:

```json
{
  "success": true,
  "data": {
    "name": "Juan Perez",
    "email": "juan@email.com",
    "points": 120
  }
}
```

Los puntos se obtienen automáticamente cuando una orden es entregada.

---

## 🧠 Reglas de Negocio Importantes

El sistema incluye lógica de negocio como:

- Control de stock de menús
- Conteo de ventas por producto
- Promociones automáticas
- Asignación de mesas
- Liberación de mesas
- Sistema de puntos de fidelidad
- Control de horario de restaurantes