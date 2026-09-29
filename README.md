# SugarCoach Portal

Una plataforma completa para el control y monitoreo de diabetes, con un portal web para médicos y un BFF (Backend-For-Frontend) como API Gateway seguro.

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Desarrollo](#desarrollo)
- [Deployment](#deployment)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Contribuir](#contribuir)

## 🎯 Descripción General

SugarCoach Portal es un ecosistema integral para el manejo de diabetes que consta de:

- **App Android** (Kotlin/Compose) - Para pacientes
- **Portal Web** (React + Vite) - Para médicos
- **BFF** (Fastify) - API Gateway seguro
- **CMS Backend** (Strapi + GraphQL) - En DigitalOcean

Este repositorio contiene la estructura de monorepo para el Portal Web y el BFF.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    Cliente Android                       │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────┐
│                                                           │
│  ┌────────────────────┐          ┌──────────────────┐   │
│  │   Portal Web       │          │  BFF (API GW)    │   │
│  │  (React + Vite)    │◄────────►│   (Fastify)      │   │
│  │                    │          │                  │   │
│  └────────────────────┘          └────────┬─────────┘   │
│                                           │              │
│  ┌────────────────────┐                   │              │
│  │  Design Tokens     │                   │              │
│  │  Shared Schemas    │                   │              │
│  └────────────────────┘                   │              │
└───────────────────────────────────────────┼──────────────┘
                                            │
                          ┌─────────────────▼──────────┐
                          │   Strapi Backend           │
                          │  (GraphQL + PostgreSQL)    │
                          │  (DigitalOcean)            │
                          └────────────────────────────┘
```

## 🚀 Requisitos Previos

- **Node.js** 22+
- **pnpm** 9+
- **Git**
- **Docker** (opcional, para desarrollo local)

## 📦 Instalación

### Clonar el repositorio

```bash
git clone https://github.com/SugarCoach/sugarcoach-portal.git
cd sugarcoach-portal
```

### Instalar dependencias

```bash
pnpm install
```

Esto instala todas las dependencias del monorepo, incluyendo los paquetes compartidos.

## 💻 Desarrollo

### Estructura del Monorepo

```
sugarcoach-portal/
├── apps/
│   ├── portal/           # React SPA para médicos
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── App.tsx
│   │       └── components/
│   └── bff/              # Fastify API Gateway
│       └── src/
│           ├── index.ts
│           ├── routes/
│           └── services/
├── packages/
│   ├── shared/           # Tipos y esquemas Zod compartidos
│   │   └── src/
│   │       ├── schemas/  # Validaciones
│   │       └── types/    # Tipos TypeScript
│   └── design-tokens/    # Tokens de diseño y utilidades
│       └── src/
│           ├── colors/   # Paleta de colores
│           └── styles/   # Utilidades CSS
├── turbo.json            # Configuración de Turborepo
├── pnpm-workspace.yaml   # Configuración de workspaces
└── package.json          # Script raíz
```

### Comandos Disponibles

```bash
# Instalar dependencias
pnpm install

# Iniciar desarrollo (todos los paquetes en paralelo)
pnpm dev

# Build de producción
pnpm build

# Verificar tipos TypeScript
pnpm typecheck

# Linting
pnpm lint

# Tests
pnpm test
```

### Desarrollo de Portal Web

```bash
cd apps/portal
pnpm dev
```

Accede en `http://localhost:3000`

El portal web proxea las llamadas a la API en `/api` hacia `http://localhost:3001`

### Desarrollo del BFF

```bash
cd apps/bff
pnpm dev
```

El servidor estará en `http://localhost:3001`

**Endpoints disponibles:**
- `GET /health` - Health check
- `GET /api/glucose` - Obtener medidas de glucosa
- `POST /api/glucose` - Crear medida de glucosa
- `POST /api/verify-doctor-qr` - Verificar QR de doctor

## 🔐 Variables de Entorno

### Portal Web (apps/portal/.env)

```env
VITE_API_URL=http://localhost:3001
```

### BFF (apps/bff/.env)

```env
NODE_ENV=development
LOG_LEVEL=debug
STRAPI_URL=https://your-strapi-instance.com
STRAPI_GRAPHQL_ENDPOINT=/graphql
FIREBASE_PROJECT_ID=your-firebase-project
FIREBASE_PRIVATE_KEY=your-firebase-key
FIREBASE_CLIENT_EMAIL=your-firebase-email
```

## 🚀 Deployment

### Staging

Push a la rama `develop`:

```bash
git push origin develop
```

Esto dispara automáticamente el workflow `deploy-staging.yml` en GitHub Actions.

### Producción

Push a la rama `main` o crear un tag de versión:

```bash
git push origin main
# o
git tag v1.0.0
git push origin v1.0.0
```

Esto dispara automáticamente el workflow `deploy-production.yml`.

## 📋 Variables de Secretos en GitHub Actions

Necesitas configurar los siguientes secretos en GitHub (Settings > Secrets and variables > Actions):

### Para Staging (`STAGING_*`)
- `STAGING_DEPLOY_KEY` - Clave SSH o token para deploy
- `STAGING_FIREBASE_SERVICE_ACCOUNT` - JSON con credenciales Firebase

### Para Producción (`PRODUCTION_*`)
- `PRODUCTION_DEPLOY_KEY` - Clave SSH o token para deploy
- `PRODUCTION_FIREBASE_SERVICE_ACCOUNT` - JSON con credenciales Firebase

## 🌿 Ramas de Desarrollo

El proyecto utiliza el siguiente flujo de Git:

```
main (producción)
  ↑
  └─── develop (staging)
         ↑
         └─── feature/* (desarrollo)
```

### Crear una rama de feature

```bash
git checkout develop
git pull origin develop
git checkout -b feature/tu-feature
```

### Workflow de Pull Request

1. Crea una rama desde `develop`
2. Realiza tus cambios y commits
3. Abre un PR hacia `develop`
4. Una vez merged a `develop`, se despliega a staging
5. Cuando esté listo, merge `develop` → `main` para producción

## 📦 Paquetes Compartidos

### @sugarcoach/shared

Contiene esquemas de validación y tipos TypeScript compartidos:

```typescript
import { 
  GlucoseMeasurement, 
  DoctorInviteQr,
  validateGlucoseMeasurement,
  validateDoctorInviteQr
} from '@sugarcoach/shared'

// Validar datos con Zod
const measurement = validateGlucoseMeasurement({
  value: 120,
  unit: 'mg/dL',
  timestamp: new Date()
})
```

### @sugarcoach/design-tokens

Exporta tokens de diseño y utilidades:

```typescript
import { 
  glucoseColors, 
  getGlucoseColor,
  glassmorphismStyles 
} from '@sugarcoach/design-tokens'

const color = getGlucoseColor(150) // 'normal'
// color === '#10B981'
```

## 🔄 Turborepo

El proyecto usa Turborepo para orquestar builds y tareas:

```bash
# Ver tarea específica en un paquete
pnpm turbo run build --filter=@sugarcoach/shared

# Build con caché
pnpm turbo run build --cache

# Ejecutar en paralelo
pnpm turbo run dev --parallel
```

## 🧪 Testing

```bash
pnpm test                    # Ejecutar todos los tests
pnpm test --filter=portal    # Tests solo del portal
pnpm test --watch            # Modo watch
```

## 📱 Tech Stack

### Portal Web
- **React** 18
- **Vite** 5
- **TypeScript** 5
- **Tailwind CSS** 3
- **Zod** para validación

### BFF
- **Fastify** 5
- **Node.js** 22
- **TypeScript** 5
- **GraphQL Request** para Strapi
- **Firebase Admin SDK**

### Compartido
- **Zod** 3 para validación
- **TypeScript** 5

## 🤝 Contribuir

### Proceso de Contribución

1. Fork el repositorio
2. Crea una rama de feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

### Estándares de Código

- TypeScript strict mode activado
- ESLint para linting
- Prettier para formatting
- Tests unitarios requeridos para nuevas features

## 📝 Licencia

Este proyecto es privado y propiedad de SugarCoach.

## 📧 Contacto

Para preguntas o issues, contacta al equipo de desarrollo en:
- Email: dev@sugarcoach.io
- Issues: https://github.com/SugarCoach/sugarcoach-portal/issues

---

**Última actualización:** 2026-09-29  
**Versión:** 1.0.0
