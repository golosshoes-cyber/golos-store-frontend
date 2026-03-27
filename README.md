# Golos Store Frontend

Frontend React + TypeScript (Vite + MUI) para:

1. Panel interno de gestion (inventario/ventas/compras)
2. Tienda online publica (catalogo, carrito, checkout y estado de pedido)

## Stack

- React 18
- TypeScript
- Vite
- Material UI
- React Router
- TanStack Query
- Axios

## Requisitos

- Node 18+
- npm
- Backend corriendo y accesible por `/api`

## Desarrollo local

```bash
npm install
npm run dev
```

Dev server por defecto: `http://localhost:3000`

## Build

```bash
npm run build
npm run preview
```

## Variables de entorno (actual)

Archivo: `.env`

```bash
VITE_STORE_WHATSAPP_NUMBER=573001112233
VITE_STORE_WHATSAPP_MESSAGE=Hola, quiero ayuda con una compra en Golos Store.
```

## Configuracion API

`src/services/api.ts` usa `baseURL: '/'`.

En desarrollo, Vite proxy redirige `/api` a Django (ver `vite.config.ts`).
En produccion, lo recomendado es servir frontend y backend bajo el mismo dominio (Nginx reverse proxy).

## Funcionalidades Destacadas

### Panel Interno (Dashboard)
- **Notificaciones en Tiempo Real**: Sistema de alertas persistente ("campanita") conectado vía WebSockets.
- **Módulo POS**: Diseño refinado de Tickets optimizado para impresoras térmicas.
- **Gestión Integral**: Inventario, Ventas, Reportes Financieros, Compras y Administración de Usuarios/Grupos.

### Tienda Online
- **Catálogo Público**: Variantes, selector de cantidad y buscador.
- **UI Moderna y Limpia**: Tarjetas de producto amigables, eliminación del quick view modal, header compacto con menú de usuario (avatar, mi cuenta).
- **Detalle de Producto Mejorado**: Zoom interactivo sobre imágenes para una inspección profunda.
- **Cuentas de Cliente**: Manejo de sesiones y flujo seguro de recuperación de contraseña.
- **Carrito y Checkout**: Checkout optimizado en español con stepper, integración de guías, y pasarela de pago Wompi.
- Badge dinámico de `Últimas unidades` (stock mínimo).
- Botón flotante de ayuda vía WhatsApp configurable.

## Rutas principales

Publicas:

- `/store`
- `/store/cart`
- `/store/checkout`
- `/store/order-status`
- `/store/terms`
- `/store/login`
- `/store/register`
- `/store/account`

Internas:

- `/dashboard`
- `/products`
- `/sales`
- `/inventory`
- `/purchases`
- `/suppliers`
- `/store/ops` (Managers)
- `/admin/users` (Managers)
- `/admin/groups` (Managers)

## Despliegue recomendado

- Opcion simple: mismo VPS del backend (Nginx sirve `dist` + proxy `/api`)
- Opcion separada: frontend estatico (Cloudflare Pages/Vercel) + backend en GCP

## Comandos de calidad

```bash
npm run lint
npm run build
```
