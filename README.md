# Expense App — Next.js

**Aplicación para el control de gastos personales** desarrollada con **Next.js (App Router)**, autenticación con **NextAuth (Credentials)**, persistencia con **Prisma + SQLite**, formularios con **react-hook-form** y visualizaciones con **Chart.js**.

---

## 🔎 Descripción

Esta app permite a los usuarios registrarse, iniciar sesión y gestionar sus gastos (crear, listar, editar y eliminar). Incluye gráficos para analizar los gastos por categoría y por periodo.

---

## ✅ Características principales

- Autenticación por email/contraseña (NextAuth + bcrypt)
- CRUD de gastos asociado a usuarios
- Gráficos de barras y líneas para análisis de gastos
- Validación de formularios con **zod** y **react-hook-form**
- Persistencia con **Prisma** (SQLite) y migraciones incluidas
- Componentes con diseño responsivo (TailwindCSS)

---

## 🧰 Tecnologías

- Next.js (App Router)
- TypeScript
- NextAuth (Credentials provider)
- Prisma + SQLite
- TailwindCSS
- Chart.js + react-chartjs-2
- react-hook-form, zod, axios, sweetalert2

---

## 🚀 Empezando (local)

1. Clona el repositorio:

```bash
git clone <tu-repo-url>
cd expense-app-next
```

2. Instala dependencias:

```bash
npm install
# o
pnpm install
# o
yarn
```

3. Crea un archivo `.env` en la raíz con al menos estas variables:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="una_frase_secreta"
# Opcional: NEXTAUTH_URL=http://localhost:3000
```

4. Aplica las migraciones / inicializa la base de datos:

```bash
# En desarrollo
npx prisma migrate dev --name init
# Alternativa para sincronizar el esquema sin crear migración (no recomendado en producción)
npx prisma db push
```

5. Ejecuta la app en modo desarrollo:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Abre http://localhost:3000

---

## 📦 Scripts útiles

- `npm run dev` — Ejecutar en modo desarrollo
- `npm run build` — Construir para producción
- `npm run start` — Iniciar servidor en producción (tras `build`)
- `npm run lint` — Ejecutar ESLint

Prisma:

- `npx prisma migrate dev --name <nombre>` — Crear/aplicar migración en dev
- `npx prisma db push` — Sincronizar esquema con la DB
- `npx prisma studio` — Abrir Prisma Studio (UI para explorar datos)

---

## 🔐 Variables de entorno

- `DATABASE_URL` — URL de la base de datos (ej. `file:./dev.db` para SQLite)
- `AUTH_SECRET` — Secreto para NextAuth
- (Opcional) `NEXTAUTH_URL` — URL base de la app en producción

No subas tus secretos al repositorio público.

---

## ☁️ Despliegue

Se recomienda desplegar en Vercel para una integración directa con Next.js. Configura las variables de entorno (`DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`) en el dashboard de tu proveedor.

Nota: SQLite funciona para prototipos y proyectos pequeños; para producción con alta concurrencia, cambia a Postgres o MySQL (actualiza `prisma/schema.prisma` y `DATABASE_URL`).

---

## 🗂 Estructura relevante

- `app/` — Rutas, páginas y componentes
- `app/api/` — Endpoints API (auth, expenses)
- `lib/` — Configuración (Prisma, auth)
- `prisma/` — Esquema y migraciones
- `package.json` — Dependencias y scripts
