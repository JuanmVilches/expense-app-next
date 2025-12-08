# Estructura Mejorada del Proyecto - Comparación

## Estructura ACTUAL (Funcionando)

```
app/
├── api/
│   └── auth/
│       ├── [...nextauth]/
│       └── register/
├── components/
├── context/
├── form/
├── list/
├── login/
└── ui/

lib/
├── auth.ts
├── prisma.ts
└── icons/
```

## Estructura MEJORADA (Recomendada)

```
app/
├── api/                    # Endpoints API
│   ├── auth/
│   │   ├── [...nextauth]/
│   │   └── register/
│   └── expenses/           # ← NUEVO: endpoints de gastos
│
├── components/             # Componentes reutilizables (sin lógica)
├── context/
├── hooks/                  # ← NUEVO: React hooks personalizados
│   ├── useAuth.ts
│   ├── useFetch.ts
│   └── index.ts
│
├── services/               # ← NUEVO: Lógica de negocio (DB, APIs)
│   ├── userService.ts      # Operaciones con usuarios
│   ├── expenseService.ts   # Operaciones con gastos
│   └── index.ts
│
├── types/                  # ← NUEVO: Tipos TypeScript centralizados
│   ├── user.ts
│   ├── expense.ts
│   └── index.ts
│
├── constants/              # ← NUEVO: Constantes y validaciones
│   ├── routes.ts           # Rutas de la app
│   ├── expenses.ts         # Categorías y validaciones de gastos
│   ├── validation.ts       # Esquemas Zod para auth
│   └── index.ts
│
├── form/
├── list/
├── login/
└── ui/

lib/
├── auth.ts
├── prisma.ts
├── utils/                  # ← NUEVO: Funciones auxiliares
│   ├── formatters.ts       # Formateo de datos
│   ├── api.ts              # Helpers para API responses
│   └── index.ts
└── icons/
```

---

## Cómo Usar la Nueva Estructura

### 1. **Types** - Define tus tipos una sola vez

```typescript
// app/types/user.ts
export interface User {
  id: number;
  email: string;
  name: string | null;
}

// Úsalo en cualquier lado:
import type { User } from "@/app/types";
```

### 2. **Services** - Centraliza lógica de DB/APIs

```typescript
// app/services/userService.ts
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

// En tu API route:
import { getUserByEmail } from "@/app/services";
const user = await getUserByEmail(email);
```

### 3. **Hooks** - Reutiliza lógica en componentes

```typescript
// app/hooks/useAuth.ts
export function useAuth() {
  const { data: session } = useSession();
  return session?.user || null;
}

// En tu componente:
"use client";
import { useAuth } from "@/app/hooks";

export default function Profile() {
  const user = useAuth();
  return <div>{user?.email}</div>;
}
```

### 4. **Constants** - Centraliza valores fijos y validaciones

```typescript
// app/constants/routes.ts
export const ROUTES = {
  LOGIN: "/login",
  FORM: "/form",
};

// app/constants/validation.ts
export const registerValidation = z.object({
  email: z.string().email(),
  // ...
});

// En tu API route:
import { registerValidation } from "@/app/constants";
const result = registerValidation.parse(data);
```

### 5. **Utils** - Funciones reutilizables

```typescript
// lib/utils/formatters.ts
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
}

// En tu componente:
import { formatCurrency } from "@/lib/utils";
<span>${formatCurrency(expense.monto)}</span>
```

---

## Ventajas de Esta Estructura

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Localización de tipos** | Dispersos | Centralizados en `app/types/` |
| **Reutilización de lógica** | Duplicada | Centralizada en `app/services/` |
| **Validaciones** | Ad-hoc | Centralizadas con Zod |
| **Constantes** | Hardcodeadas | `app/constants/` |
| **Escalabilidad** | Difícil | Fácil de crecer |
| **Mantenibilidad** | Media | Alta |
| **Testing** | Difícil | Fácil (servicios aislados) |

---

## Pasos para Migrar (Recomendado)

1. **Empezar con `types/`** → Define tipos centralizados
2. **Luego `constants/`** → Mueve valores y validaciones Zod
3. **Luego `services/`** → Crea funciones reutilizables de DB
4. **Luego `hooks/`** → Crea hooks personalizados
5. **Finalmente `lib/utils/`** → Mueve helpers

---

## Ejemplo: Antes vs Después

### ANTES (Duplicación)

```typescript
// app/api/auth/register/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (user) return NextResponse.json({ error: "Email exists" });
  // ...
}

// app/components/RegisterForm.tsx
const onSubmit = async (data) => {
  const res = await axios.post('/api/auth/register', {
    email: data.email,
    name: data.name,
    password: data.password,
  });
};
```

### DESPUÉS (Centralizado)

```typescript
// app/constants/validation.ts
export const registerValidation = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
});

// app/services/userService.ts
export async function createUser(payload: RegisterPayload) {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  return prisma.user.create({
    data: { email: payload.email, name: payload.name, password: hashedPassword },
  });
}

// app/api/auth/register/route.ts
import { registerValidation } from "@/app/constants";
import { createUser, emailExists } from "@/app/services";

export async function POST(request: Request) {
  const data = registerValidation.parse(await request.json());
  if (await emailExists(data.email)) {
    return errorResponse("Email already exists");
  }
  const user = await createUser(data);
  return successResponse(user);
}

// app/components/RegisterForm.tsx
import { useFetch } from "@/app/hooks";
import { ROUTES } from "@/app/constants";

export default function RegisterForm() {
  const { execute, loading } = useFetch(ROUTES.API.AUTH.REGISTER, {
    method: "POST",
  });

  const onSubmit = async (data) => {
    await execute(data);
  };
}
```

---

## ¿Está lista la nueva estructura?

✅ Todos los archivos se han creado en:
- `app/types/` - user.ts, expense.ts, index.ts
- `app/constants/` - routes.ts, expenses.ts, validation.ts, index.ts
- `app/services/` - userService.ts, expenseService.ts, index.ts
- `app/hooks/` - useAuth.ts, useFetch.ts, index.ts
- `lib/utils/` - formatters.ts, api.ts, index.ts

Puedes comparar con tu estructura actual y migrar paso a paso.

