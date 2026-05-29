# Backend Performance — Golos Store

## No migrar de lenguaje
Python + Django REST + PostgreSQL bien configurado maneja cientos de miles de productos. El cuello de botella son las queries, no Python.

## Base de Datos (PostgreSQL)
- Índices compuestos creados:
  - `(status, created_at)` en sales ✅
  - `(product, size, color)` en variants ✅
  - `(name)` en products ✅
  - `(brand)` en products ✅
  - `(current_stock)` en variants (para queries de stock bajo) ✅
- Particionamiento por fecha en tablas grandes: `inventory_history`, `sales` ⏳
- Materialized views para reportes pesados ⏳

## Django REST Framework
- ✅ Serializer de lista vs detalle (`ProductListSerializer` 8 campos / `ProductReadSerializer` completo)
- ✅ `prefetch_related` en `ProductViewSet` (3 queries en vez de N+1)
- ✅ `current_stock` como campo real (evita `Sum('movements')` en cada request)
- ✅ Dashboard: TTL 5 min, endpoints cacheados, cálculos usan `current_stock` field
- Paginación con cursor en vez de page number ⏳
- `select_related` / `prefetch_related` en todos los viewsets ⏳
- Throttling + Redis ⏳

## Endpoints optimizados
1. `/api/products/` — ✅ `prefetch_related` + `ProductListSerializer` (8 campos ligeros) para `list`, `ProductReadSerializer` solo para `retrieve`.
2. `/api/dashboard/overview/` — ✅ TTL 300s, valores cacheados, cálculos sobre `current_stock` field.
3. `/api/dashboard/low-stock/` — ✅ Cacheado.
4. `/api/inventory-history/` — tabla crece rápido → particionar por mes ⏳
5. `/api/product-variants/` — sin paginación masiva ⏳

## Frontend: timeouts
- Axios `timeout: 30s`
- Queries de listas con `staleTime: 30s`
