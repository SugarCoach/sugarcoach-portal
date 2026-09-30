# Contributing to SugarCoach Portal

## Requisitos previos

- Node.js 22 LTS
- pnpm 9.x (`npm install -g pnpm`)
- Git

## Setup local (primera vez)

```bash
git clone https://github.com/SugarCoach/sugarcoach-portal.git
cd sugarcoach-portal
pnpm install
cp apps/bff/.env.example apps/bff/.env
# Completar las variables en apps/bff/.env antes de levantar el BFF
pnpm dev
```

El portal corre en http://localhost:5173
El BFF corre en http://localhost:3001
Health check: http://localhost:3001/health

## Variables de entorno (apps/bff/.env)

Pedirle a Isabel o a SLOT B los valores de staging. Nunca commitear el .env.

## Flujo de trabajo

1. Crear rama desde develop: `git checkout develop && git pull && git checkout -b feature/nombre-descriptivo`
2. Hacer cambios en commits pequeños con Conventional Commits
3. Push y abrir PR hacia develop
4. El PR necesita al menos 1 aprobación del núcleo antes de mergear
5. Nunca trabajar directamente en develop ni en main

## Convención de commits (Conventional Commits)

```
feat(bff): descripción corta
feat(portal): descripción corta
fix(bff): descripción corta
test(bff): descripción corta
chore(infra): descripción corta
docs: descripción corta
```

## Reglas de PR

* Máximo 400 líneas de cambio por PR — si es más grande, dividirlo
* El título del PR sigue la misma convención que los commits
* Describir qué cambia y por qué, no cómo (el código muestra el cómo)
* Los PRs que tocan auth.ts, authorize.ts o cualquier middleware de seguridad requieren review de Isabel

## Lo que NO hacer

* Nunca commitear .env, service account keys, tokens ni API keys
* Nunca pushear a main directamente
* Nunca mergear un PR propio sin aprobación
* No arrancar endpoints de /patients hasta que authorize.ts esté implementado y aprobado

---

**Última actualización:** 2026-09-30
