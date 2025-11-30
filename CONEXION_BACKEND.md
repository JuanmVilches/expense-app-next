# Guía de Conexión al Backend

Esta guía explica cómo conectar tu aplicación Next.js con un backend API para reemplazar el almacenamiento en localStorage.

## 1. Configuración de Variables de Entorno

Primero, crea un archivo `.env.local` en la raíz del proyecto para almacenar la URL de tu backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
# O para producción:
# NEXT_PUBLIC_API_URL=https://tu-backend.com/api
```

**Nota:** El prefijo `NEXT_PUBLIC_` es necesario para que la variable sea accesible en el cliente.

## 2. Crear un Cliente API

Crea un archivo `app/lib/api.ts` para centralizar todas las llamadas al backend:

```typescript
import { Expense } from "../definitions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Función auxiliar para manejar errores
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Error ${response.status}`);
  }
  return response.json();
}

// Obtener todos los gastos
export async function getExpenses(): Promise<Expense[]> {
  const response = await fetch(`${API_URL}/expenses`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse<Expense[]>(response);
}

// Crear un nuevo gasto
export async function createExpense(
  expense: Omit<Expense, "id">
): Promise<Expense> {
  const response = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });
  return handleResponse<Expense>(response);
}

// Eliminar un gasto
export async function deleteExpense(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Error ${response.status}`);
  }
}

// Actualizar un gasto (opcional)
export async function updateExpense(
  id: string,
  expense: Partial<Expense>
): Promise<Expense> {
  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });
  return handleResponse<Expense>(response);
}
```

## 3. Modificar el ExpenseContext

Actualiza `app/context/ExpenseContext.tsx` para usar el backend en lugar de localStorage:

```typescript
"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Expense } from "../definitions";
import { getExpenses, createExpense, deleteExpense } from "../lib/api";

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar gastos al montar el componente
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los gastos"
      );
      console.error("Error loading expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: Expense) => {
    try {
      setError(null);
      // El backend generará el ID, así que lo omitimos
      const { id, ...expenseWithoutId } = expense;
      const newExpense = await createExpense(expenseWithoutId);
      setExpenses((prev) => [...prev, newExpense]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al agregar el gasto"
      );
      console.error("Error adding expense:", err);
      throw err; // Re-lanzar para que el componente pueda manejarlo
    }
  };

  const deleteExpenseHandler = async (id: string) => {
    try {
      setError(null);
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar el gasto"
      );
      console.error("Error deleting expense:", err);
      throw err; // Re-lanzar para que el componente pueda manejarlo
    }
  };

  return (
    <ExpenseContext
      value={{
        expenses,
        addExpense,
        deleteExpense: deleteExpenseHandler,
        loading,
        error,
      }}
    >
      {children}
    </ExpenseContext>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
}
```

## 4. Manejo de Errores en los Componentes

Actualiza tus componentes para manejar los estados de carga y error:

```typescript
// Ejemplo en app/form/page.tsx
const { addExpense, error } = useExpenses();
const [isSubmitting, setIsSubmitting] = useState(false);

const onSubmit = handleSubmit(async (data) => {
  try {
    setIsSubmitting(true);
    await addExpense(data);
    reset();
    // Mostrar mensaje de éxito
  } catch (err) {
    // El error ya está en el contexto, pero puedes manejarlo aquí también
    console.error("Error al enviar:", err);
  } finally {
    setIsSubmitting(false);
  }
});
```

## 5. Estructura Esperada del Backend

Tu backend debe implementar los siguientes endpoints:

### GET `/api/expenses`

Retorna un array de gastos:

```json
[
  {
    "id": "1",
    "descripcion": "Comida",
    "monto": 50.0,
    "categoria": "Alimentación",
    "fecha": "2024-01-15"
  }
]
```

### POST `/api/expenses`

Crea un nuevo gasto. Recibe:

```json
{
  "descripcion": "Comida",
  "monto": 50.0,
  "categoria": "Alimentación",
  "fecha": "2024-01-15"
}
```

Retorna el gasto creado con su `id` asignado.

### DELETE `/api/expenses/:id`

Elimina un gasto por su ID. Retorna 204 No Content o 200 OK.

## 6. Autenticación (Opcional)

Si tu backend requiere autenticación, puedes agregar tokens:

```typescript
// En app/lib/api.ts
function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Usar en las funciones:
export async function getExpenses(): Promise<Expense[]> {
  const response = await fetch(`${API_URL}/expenses`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse<Expense[]>(response);
}
```

## 7. Usar Next.js API Routes (Alternativa)

Si prefieres usar las API Routes de Next.js en lugar de un backend externo:

1. Crea `app/api/expenses/route.ts`:

```typescript
import { NextResponse } from "next/server";

export async function GET() {
  // Lógica para obtener gastos (desde base de datos, etc.)
  return NextResponse.json([]);
}

export async function POST(request: Request) {
  const body = await request.json();
  // Lógica para crear gasto
  return NextResponse.json({ id: "1", ...body });
}
```

2. Actualiza `API_URL` en `.env.local`:

```env
NEXT_PUBLIC_API_URL=/api
```

## 8. Migración Gradual

Para migrar gradualmente de localStorage al backend:

1. Mantén ambos sistemas funcionando en paralelo
2. Sincroniza datos al cargar la aplicación
3. Prioriza el backend, usa localStorage como fallback
4. Una vez verificado, elimina el código de localStorage

## Consideraciones Importantes

- **CORS:** Asegúrate de que tu backend permita requests desde tu dominio
- **Error Handling:** Siempre maneja errores de red y del servidor
- **Loading States:** Muestra estados de carga para mejorar la UX
- **Optimistic Updates:** Considera actualizar la UI antes de confirmar con el servidor
- **Retry Logic:** Implementa reintentos para requests fallidos
- **Cache:** Considera usar React Query o SWR para mejor manejo de caché
