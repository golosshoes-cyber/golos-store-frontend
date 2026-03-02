# Modulo Admin (Frontend)

Pantallas de administracion de usuarios y grupos para el panel interno.

## Paginas

- `UsersManagement.tsx`
- `GroupsManagement.tsx`

## Acceso

Rutas protegidas por `ProtectedRoute`:

- `/admin/users`
- `/admin/groups`

Requiere grupo:

- `Managers`

## Integracion backend

Endpoints usados:

- `GET/POST /api/users/`
- `GET/PUT/DELETE /api/users/{id}/`
- `GET/POST /api/groups/`
- `GET/PUT/DELETE /api/groups/{id}/`

## Recomendaciones operativas

- usuarios del dia a dia para pedidos online: grupo `StoreOps`
- administracion completa del sistema: grupo `Managers`

## Nota de consistencia

En backend el nombre correcto del grupo administrativo es `Managers`.
