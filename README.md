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
- Persistencia con **Prisma** (PostgreSQL) y migraciones incluidas
- Componentes con diseño responsivo (TailwindCSS)

---

## 🧰 Tecnologías

- Next.js (App Router)
- TypeScript
- NextAuth (Credentials provider)
- Prisma + PostgreSQL
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

---

## ☁️ Despliegue

Se recomienda desplegar en Vercel para una integración directa con Next.js. Configura las variables de entorno (`DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`) en el dashboard de tu proveedor.

---

## 🗂 Estructura del proyecto

A continuación se describen las carpetas y archivos más importantes y con qué propósito sirven:

- `app/` — Código de la aplicación (App Router).

  - `app/page.tsx` — Página de inicio.
  - `app/layout.tsx` — Layout global (cabezera, pie, provider, etc.).
  - `app/components/` — Componentes reutilizables (ej. `Navigation.tsx`, `RegisterForm.tsx`, `SessionProvider.tsx`).
  - Rutas/páginas: `app/dashboard/`, `app/form/`, `app/list/`, `app/login/` — Páginas principales y clientes (Client Components).
  - `app/api/` — Endpoints API (p. ej. `auth` para NextAuth y `expenses` para el CRUD).

- `lib/` — Configuración y helpers.

  - `lib/auth.ts` — Configuración de NextAuth (providers, callbacks, secret).
  - `lib/prisma.ts` — Inicialización de Prisma con `@prisma/adapter-better-sqlite3`.
  - Otros: `lib/chartData.ts`, `lib/icons/` y utilidades compartidas.

- `prisma/` — Esquema y migraciones.

  - `schema.prisma` — Modelos (`User`, `Expenses`).
  - `migrations/` — Migraciones generadas (versión controlada para cambios en el esquema).

- `app/services/` — Lógica de acceso a datos usada por el frontend (`userService.ts`, `expenseService.ts`).
- `context/` — Contextos React (por ejemplo `ExpenseContext.tsx`) para estado compartido.
- `app/hooks/` — Hooks personalizados (`useAuth`, `useFetch`).
- `app/ui/` — Módulos CSS y estilos (p. ej. `form.module.css`, `list.module.css`).
- Archivos de configuración principales: `package.json`, `next.config.ts`, `tsconfig.json`, `.eslintrc`.
