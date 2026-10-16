# Configuración de Secretos - GitHub Actions

Este documento describe cómo configurar los secretos necesarios para que los workflows de CI/CD funcionen correctamente.

## 📋 Secretos Requeridos

### 1. **STAGING_DEPLOY_KEY**

Clave SSH o token de deploy para staging.

**Pasos:**

a) Generar clave SSH (si no tienes una):
```bash
ssh-keygen -t ed25519 -C "github-actions-staging" -f github_actions_staging
```

b) Ir a GitHub > Settings > Secrets and variables > Actions

c) Crear nuevo secreto:
- **Name:** `STAGING_DEPLOY_KEY`
- **Value:** Contenido de la clave privada (el archivo `github_actions_staging`, sin la extensión)

d) Agregar la clave pública en tu servidor de staging:
```bash
cat github_actions_staging.pub >> ~/.ssh/authorized_keys
```

---

### 2. **STAGING_FIREBASE_SERVICE_ACCOUNT**

Credenciales JSON de Firebase para staging.

**Pasos:**

a) En Firebase Console:
- Ir a Project Settings > Service Accounts
- Click en "Generate New Private Key"
- Descarga el archivo JSON

b) En GitHub > Settings > Secrets and variables > Actions:
- **Name:** `STAGING_FIREBASE_SERVICE_ACCOUNT`
- **Value:** Todo el contenido del archivo JSON descargado (como una sola línea)

Ejemplo:
```
{"type":"service_account","project_id":"sugarcoach-staging",...}
```

---

### 3. **PRODUCTION_DEPLOY_KEY**

Clave SSH o token de deploy para producción.

**Pasos:** (Similar a STAGING_DEPLOY_KEY)

a) Generar clave SSH:
```bash
ssh-keygen -t ed25519 -C "github-actions-production" -f github_actions_production
```

b) En GitHub > Settings > Secrets and variables > Actions:
- **Name:** `PRODUCTION_DEPLOY_KEY`
- **Value:** Contenido de la clave privada

c) Agregar en servidor de producción:
```bash
cat github_actions_production.pub >> ~/.ssh/authorized_keys
```

---

### 4. **PRODUCTION_FIREBASE_SERVICE_ACCOUNT**

Credenciales JSON de Firebase para producción.

**Pasos:** (Similar a STAGING_FIREBASE_SERVICE_ACCOUNT)

a) En Firebase Console (Proyecto de Producción):
- Ir a Project Settings > Service Accounts
- Click en "Generate New Private Key"
- Descarga el archivo JSON

b) En GitHub > Settings > Secrets and variables > Actions:
- **Name:** `PRODUCTION_FIREBASE_SERVICE_ACCOUNT`
- **Value:** Todo el contenido del archivo JSON

---

## 🔐 Seguridad

### Mejores Prácticas

1. **Nunca commits secretos** al repositorio
2. **Usa claves separadas** para staging y producción
3. **Rota las claves** periódicamente (cada 3-6 meses)
4. **Revisa los logs** de GitHub Actions (sin mostrar secretos)
5. **Auditá los accesos** en GitHub Settings > Audit log

### Archivo .env (Local)

Para desarrollo local, crea archivos `.env` locales (nunca commits):

**apps/portal/.env.local**
```env
VITE_API_URL=http://localhost:3001
```

**apps/bff/.env.local**
```env
NODE_ENV=development
LOG_LEVEL=debug
STRAPI_URL=http://localhost:1337
STRAPI_GRAPHQL_ENDPOINT=/graphql
FIREBASE_PROJECT_ID=your-local-firebase-project
FIREBASE_PRIVATE_KEY=your-local-firebase-key
FIREBASE_CLIENT_EMAIL=your-local-firebase-email
```

Añade al `.gitignore`:
```
.env.local
.env.*.local
```

---

## 🔄 Verificar que los Secretos Funcionan

1. Haz push a una rama de feature
2. Abre un Pull Request hacia `develop` o `main`
3. Verifica que el workflow de CI se ejecute sin errores
4. Revisa los logs en GitHub Actions (Settings > Actions > Workflow runs)

⚠️ Los secretos NO se mostrarán en los logs, aparecerán como `***`

---

## 📝 Actualizar Secretos

Para cambiar un secreto:

1. GitHub > Settings > Secrets and variables > Actions
2. Busca el secreto
3. Click en el ícono de edición (lápiz)
4. Actualiza el valor
5. Click en "Update secret"

**El cambio se aplica inmediatamente** para los próximos workflows.

---

## ❌ Troubleshooting

### Error: "Permission denied (publickey)"

**Causa:** La clave SSH pública no está en el servidor

**Solución:**
```bash
# Verifica que la clave pública está en authorized_keys
cat ~/.ssh/authorized_keys | grep github_actions
```

### Error: "Invalid Firebase credentials"

**Causa:** El JSON está corrupto o incompleto

**Solución:**
1. Descarga nuevamente el JSON desde Firebase Console
2. Valida que sea un JSON válido
3. Copia el contenido completo al secreto

### Error: "Secret not found in workflow"

**Causa:** El nombre del secreto está mal escrito en el workflow

**Solución:**
1. Revisa el nombre en el archivo `.yml`
2. Asegúrate que coincida exactamente en GitHub Secrets
3. Los nombres son case-sensitive

---

## 📚 Referencias

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Firebase Service Accounts](https://firebase.google.com/docs/admin/setup)
- [SSH Keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

---

**Última actualización:** 2026-09-29  
**Versión:** 1.0.0
