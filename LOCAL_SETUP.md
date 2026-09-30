# Setup Local — SugarCoach Portal

## Estructura del monorepo

```
sugarcoach-portal/
├── apps/
│   ├── portal/     # React 18 + Vite + TypeScript (frontend)
│   └── bff/        # Node.js 22 + Fastify 5 + TypeScript (backend)
├── packages/
│   ├── shared/     # Tipos TypeScript + schemas Zod compartidos
│   └── design-tokens/  # Variables CSS del light theme
```

## Paso 1 — Instalar prerequisitos

* Node.js 22 LTS: https://nodejs.org
* pnpm: `npm install -g pnpm@9`
* Verificar: `node -v` (debe ser 22.x) y `pnpm -v` (debe ser 9.x)

## Paso 2 — Clonar e instalar

```bash
git clone https://github.com/SugarCoach/sugarcoach-portal.git
cd sugarcoach-portal
git checkout develop
pnpm install
```

## Paso 3 — Configurar variables de entorno del BFF

```bash
cp apps/bff/.env.example apps/bff/.env
```

Abrir `apps/bff/.env` y completar:

* `STRAPI_GRAPHQL_URL` y `STRAPI_API_TOKEN`: pedirlos a Isabel o SLOT B (valores de staging)
* `FIREBASE_PROJECT_ID` y `FIREBASE_SERVICE_ACCOUNT_KEY`: pedirlos a Isabel o SLOT C
* `CORS_ORIGIN`: dejar vacío en local (usa el default localhost:5173)
* `PORT`: dejar 3001

## Paso 4 — Levantar el entorno

```bash
pnpm dev
```

Esto levanta en paralelo el BFF y el portal.

Para levantar solo uno:

```bash
pnpm --filter sugarcoach-bff dev
pnpm --filter sugarcoach-portal-web dev
```

## Paso 5 — Verificar que funciona

* Portal: http://localhost:5173 (debe mostrar la pantalla de login)
* BFF health: http://localhost:3001/health (debe devolver `{"status":"ok"}`)

## Compilar (verificar TypeScript)

```bash
pnpm build
```

Los 4 packages deben compilar sin errores.

## Troubleshooting

### Error: "Cannot find module '@sugarcoach/shared'"

```bash
pnpm build --filter @sugarcoach/shared
```

El package shared debe compilarse antes que los apps.

### Error de puerto en uso

```bash
# Ver qué proceso usa el puerto
lsof -i :3001
lsof -i :5173
```

### pnpm install falla con errores de peer dependencies

```bash
pnpm install --shamefully-hoist
```

### El BFF no arranca por variables de entorno faltantes

Revisar que `apps/bff/.env` existe y tiene `FIREBASE_PROJECT_ID` y `STRAPI_GRAPHQL_URL` completos.

---

**Última actualización:** 2026-09-30
