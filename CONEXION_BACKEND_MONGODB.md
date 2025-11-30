# Guía de Conexión al Backend con MongoDB y Autenticación

Esta guía explica cómo conectar tu aplicación Next.js con un backend API usando MongoDB, implementando un sistema de autenticación con login y mostrando gastos específicos por usuario.

## 1. Estructura de MongoDB

### Modelos de Base de Datos

Necesitarás dos colecciones en MongoDB:

**Colección `users`:**

```javascript
{
  _id: ObjectId,
  email: String (único, requerido),
  password: String (hasheado, requerido),
  nombre: String,
  createdAt: Date
}
```

**Colección `expenses`:**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (referencia a users),
  descripcion: String (requerido),
  monto: Number (requerido),
  categoria: String (requerido),
  fecha: String (requerido),
  createdAt: Date
}
```

### Ejemplo de Schema con Mongoose (Backend)

```javascript
// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
```

```javascript
// models/Expense.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    monto: {
      type: Number,
      required: true,
    },
    categoria: {
      type: String,
      required: true,
    },
    fecha: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);
```

## 2. Crear Contexto de Autenticación

Primero, crea un contexto para manejar la autenticación. Crea `app/context/AuthContext.tsx`:

```typescript
"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: string;
  email: string;
  nombre: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nombre: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un token al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        // Verificar token con el backend
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem("authToken");
        }
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      localStorage.removeItem("authToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Error al iniciar sesión" }));
      throw new Error(error.message || "Error al iniciar sesión");
    }

    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    setUser(data.user);
  };

  const register = async (email: string, password: string, nombre: string) => {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, nombre }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Error al registrarse" }));
      throw new Error(error.message || "Error al registrarse");
    }

    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

## 3. Crear un Cliente API con Autenticación

Crea un archivo `app/lib/api.ts` para centralizar todas las llamadas al backend:

```typescript
import { Expense } from "../definitions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Función auxiliar para obtener headers con autenticación
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Función auxiliar para manejar errores
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Si es 401, el token puede haber expirado
    if (response.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Error ${response.status}`);
  }
  return response.json();
}

// Obtener todos los gastos del usuario autenticado
export async function getExpenses(): Promise<Expense[]> {
  const response = await fetch(`${API_URL}/expenses`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse<Expense[]>(response);
}

// Crear un nuevo gasto (automáticamente asociado al usuario autenticado)
export async function createExpense(
  expense: Omit<Expense, "id">
): Promise<Expense> {
  const response = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(expense),
  });
  return handleResponse<Expense>(response);
}

// Eliminar un gasto (solo si pertenece al usuario)
export async function deleteExpense(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
    body: JSON.stringify(expense),
  });
  return handleResponse<Expense>(response);
}
```

## 4. Modificar el ExpenseContext

Actualiza `app/context/ExpenseContext.tsx` para usar el backend y cargar solo los gastos del usuario autenticado:

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
import { useAuth } from "./AuthContext";

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  refreshExpenses: () => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Cargar gastos cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated) {
      loadExpenses();
    } else {
      setExpenses([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

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
      // El backend generará el ID y asociará al usuario, así que lo omitimos
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
        refreshExpenses: loadExpenses,
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

## 5. Crear Página de Login

Crea `app/login/page.tsx`:

```typescript
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setError(null);
      await login(data.email, data.password);
      router.push("/list"); // Redirigir después del login
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-zinc-900 p-8 rounded-lg border border-amber-200 w-full max-w-md"
      >
        <h2 className="text-white text-3xl mb-6 font-bold text-center">
          Iniciar Sesión
        </h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-white mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "El email es requerido" })}
            className="w-full p-2 rounded bg-zinc-800 text-white border border-gray-600"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-white mb-2">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "La contraseña es requerida",
            })}
            className="w-full p-2 rounded bg-zinc-800 text-white border border-gray-600"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-500 text-white p-2 rounded hover:bg-amber-600 disabled:opacity-50"
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>

        <p className="text-white text-center mt-4">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-amber-500 hover:underline">
            Regístrate
          </a>
        </p>
      </form>
    </div>
  );
}
```

## 6. Crear Página de Registro

Crea `app/register/page.tsx`:

```typescript
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";

interface RegisterForm {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await registerUser(data.email, data.password, data.nombre);
      router.push("/list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-zinc-900 p-8 rounded-lg border border-amber-200 w-full max-w-md"
      >
        <h2 className="text-white text-3xl mb-6 font-bold text-center">
          Registrarse
        </h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
        )}

        <div className="mb-4">
          <label htmlFor="nombre" className="block text-white mb-2">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            {...register("nombre", { required: "El nombre es requerido" })}
            className="w-full p-2 rounded bg-zinc-800 text-white border border-gray-600"
          />
          {errors.nombre && (
            <span className="text-red-500 text-sm">
              {errors.nombre.message}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-white mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "El email es requerido" })}
            className="w-full p-2 rounded bg-zinc-800 text-white border border-gray-600"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-white mb-2">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "La contraseña es requerida",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            })}
            className="w-full p-2 rounded bg-zinc-800 text-white border border-gray-600"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-white mb-2">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Confirma tu contraseña",
              validate: (value) =>
                value === password || "Las contraseñas no coinciden",
            })}
            className="w-full p-2 rounded bg-zinc-800 text-white border border-gray-600"
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-500 text-white p-2 rounded hover:bg-amber-600 disabled:opacity-50"
        >
          {isLoading ? "Registrando..." : "Registrarse"}
        </button>

        <p className="text-white text-center mt-4">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-amber-500 hover:underline">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}
```

## 7. Actualizar el Layout para Incluir AuthProvider

Actualiza `app/layout.tsx`:

```typescript
import "./globals.css";
import Navigation from "./components/Navigation";
import { ExpenseProvider } from "@/app/context/ExpenseContext";
import { AuthProvider } from "@/app/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Navigation />
          <ExpenseProvider>{children}</ExpenseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

## 8. Proteger Rutas (Opcional)

Crea un componente `app/components/ProtectedRoute.tsx`:

```typescript
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

Luego envuelve las rutas protegidas:

```typescript
// app/form/page.tsx
import ProtectedRoute from "../components/ProtectedRoute";

export default function Form() {
  return (
    <ProtectedRoute>{/* Tu componente de formulario aquí */}</ProtectedRoute>
  );
}
```

## 9. Actualizar Navigation con Logout

Actualiza `app/components/Navigation.tsx` para incluir logout:

```typescript
"use client";
import { navLinks } from "@/app/definitions";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null; // No mostrar navegación si no está autenticado
  }

  return (
    <header>
      <nav className="bg-[#27272a] text-white p-4 h-full">
        <div className="flex justify-between items-center">
          <ul className="flex gap-8 justify-center h-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`h-full hover:bg-gray-500 bg-gray-600 p-1 rounded-md w-20 text-center duration-300 ${
                    isActive ? "bg-gray-700" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </ul>
          <div className="flex items-center gap-4">
            <span className="text-sm">Hola, {user?.nombre}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
```

## 10. Estructura del Backend con Express y MongoDB

### Ejemplo de Backend Completo (Node.js + Express + MongoDB)

**Instalación de dependencias:**

```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
npm install -D @types/express @types/bcryptjs @types/jsonwebtoken
```

**Estructura del backend:**

```
backend/
├── server.js
├── models/
│   ├── User.js
│   └── Expense.js
├── routes/
│   ├── auth.js
│   └── expenses.js
├── middleware/
│   └── auth.js
└── .env
```

**server.js:**

```javascript
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/expense-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

// Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/expenses", require("./routes/expenses"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

**middleware/auth.js (Verificar token JWT):**

```javascript
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No hay token, acceso denegado" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "tu-secret-key"
    );
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Token inválido" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = auth;
```

**routes/auth.js:**

```javascript
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  try {
    const { email, password, nombre } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Crear nuevo usuario
    const user = new User({ email, password, nombre });
    await user.save();

    // Generar token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "tu-secret-key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        nombre: user.nombre,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Generar token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "tu-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        nombre: user.nombre,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener usuario actual
router.get("/me", require("../middleware/auth"), async (req, res) => {
  res.json({
    id: req.user._id.toString(),
    email: req.user.email,
    nombre: req.user.nombre,
  });
});

module.exports = router;
```

**routes/expenses.js:**

```javascript
const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");
const router = express.Router();

// Todas las rutas requieren autenticación
router.use(auth);

// GET /api/expenses - Obtener todos los gastos del usuario
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    // Convertir a formato esperado por el frontend
    const formattedExpenses = expenses.map((expense) => ({
      id: expense._id.toString(),
      descripcion: expense.descripcion,
      monto: expense.monto,
      categoria: expense.categoria,
      fecha: expense.fecha,
    }));

    res.json(formattedExpenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/expenses - Crear un nuevo gasto
router.post("/", async (req, res) => {
  try {
    const { descripcion, monto, categoria, fecha } = req.body;

    const expense = new Expense({
      userId: req.user._id,
      descripcion,
      monto,
      categoria,
      fecha,
    });

    await expense.save();

    res.status(201).json({
      id: expense._id.toString(),
      descripcion: expense.descripcion,
      monto: expense.monto,
      categoria: expense.categoria,
      fecha: expense.fecha,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/expenses/:id - Eliminar un gasto
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id, // Asegurar que el gasto pertenece al usuario
    });

    if (!expense) {
      return res.status(404).json({ message: "Gasto no encontrado" });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Gasto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/expenses/:id - Actualizar un gasto
router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Gasto no encontrado" });
    }

    res.json({
      id: expense._id.toString(),
      descripcion: expense.descripcion,
      monto: expense.monto,
      categoria: expense.categoria,
      fecha: expense.fecha,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

**.env del backend:**

```env
MONGODB_URI=mongodb://localhost:27017/expense-app
# O para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/expense-app

JWT_SECRET=tu-secret-key-super-segura-aqui
PORT=3001
```

## 11. Estructura Esperada de los Endpoints

### Autenticación

**POST `/api/auth/register`**

- Body: `{ email, password, nombre }`
- Retorna: `{ token, user: { id, email, nombre } }`

**POST `/api/auth/login`**

- Body: `{ email, password }`
- Retorna: `{ token, user: { id, email, nombre } }`

**GET `/api/auth/me`** (requiere token)

- Headers: `Authorization: Bearer <token>`
- Retorna: `{ id, email, nombre }`

### Gastos (todos requieren autenticación)

**GET `/api/expenses`**

- Headers: `Authorization: Bearer <token>`
- Retorna: Array de gastos del usuario autenticado

```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "descripcion": "Comida",
    "monto": 50.0,
    "categoria": "Alimentación",
    "fecha": "2024-01-15"
  }
]
```

**POST `/api/expenses`**

- Headers: `Authorization: Bearer <token>`
- Body: `{ descripcion, monto, categoria, fecha }`
- Retorna: El gasto creado con su `id` asignado

**DELETE `/api/expenses/:id`**

- Headers: `Authorization: Bearer <token>`
- Retorna: 200 OK o 404 si no existe o no pertenece al usuario

**PUT `/api/expenses/:id`**

- Headers: `Authorization: Bearer <token>`
- Body: `{ descripcion?, monto?, categoria?, fecha? }` (campos opcionales)
- Retorna: El gasto actualizado

## 12. Configuración de MongoDB

### Opción 1: MongoDB Local

1. Instala MongoDB en tu máquina
2. Inicia el servicio de MongoDB
3. Usa la URI: `mongodb://localhost:27017/expense-app`

### Opción 2: MongoDB Atlas (Recomendado para producción)

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito
3. Crea un usuario de base de datos
4. Configura el acceso de red (permite tu IP o 0.0.0.0/0 para desarrollo)
5. Obtén la connection string:
   ```
   mongodb+srv://usuario:password@cluster.mongodb.net/expense-app?retryWrites=true&w=majority
   ```
6. Úsala en tu archivo `.env` del backend

## 13. Resumen de Archivos a Crear/Modificar

### Frontend (Next.js):

1. **`app/context/AuthContext.tsx`** - Contexto de autenticación (NUEVO)
2. **`app/context/ExpenseContext.tsx`** - Modificar para usar autenticación
3. **`app/lib/api.ts`** - Modificar para incluir headers de autenticación
4. **`app/login/page.tsx`** - Página de login (NUEVO)
5. **`app/register/page.tsx`** - Página de registro (NUEVO)
6. **`app/components/ProtectedRoute.tsx`** - Componente para proteger rutas (NUEVO)
7. **`app/components/Navigation.tsx`** - Modificar para incluir logout
8. **`app/layout.tsx`** - Modificar para incluir AuthProvider
9. **`.env.local`** - Variables de entorno

### Backend (Express + MongoDB):

1. **`server.js`** - Servidor principal
2. **`models/User.js`** - Modelo de usuario
3. **`models/Expense.js`** - Modelo de gasto
4. **`routes/auth.js`** - Rutas de autenticación
5. **`routes/expenses.js`** - Rutas de gastos
6. **`middleware/auth.js`** - Middleware de autenticación
7. **`.env`** - Variables de entorno del backend

## Consideraciones Importantes

- **Seguridad:**

  - Nunca almacenes contraseñas en texto plano (usa bcrypt)
  - Usa HTTPS en producción
  - Valida y sanitiza todas las entradas del usuario
  - Usa variables de entorno para secretos (JWT_SECRET, MONGODB_URI)
  - Implementa rate limiting para prevenir ataques de fuerza bruta

- **MongoDB:**

  - Usa índices en campos frecuentemente consultados (email, userId)
  - Considera usar MongoDB Atlas para producción
  - Implementa backups regulares
  - Valida datos con Mongoose schemas

- **JWT Tokens:**

  - Usa tokens con expiración (ej: 7 días)
  - Implementa refresh tokens para mejor seguridad
  - Almacena tokens de forma segura (no en localStorage para apps críticas)

- **CORS:** Asegúrate de que tu backend permita requests desde tu dominio
- **Error Handling:** Siempre maneja errores de red y del servidor
- **Loading States:** Muestra estados de carga para mejorar la UX
- **Optimistic Updates:** Considera actualizar la UI antes de confirmar con el servidor
- **Retry Logic:** Implementa reintentos para requests fallidos
- **Cache:** Considera usar React Query o SWR para mejor manejo de caché

## Próximos Pasos

1. **Instalar MongoDB** (local o Atlas)
2. **Crear el backend** siguiendo los ejemplos de código
3. **Implementar el frontend** con los contextos y páginas de autenticación
4. **Probar el flujo completo:** registro → login → crear gasto → ver gastos
5. **Agregar validaciones** adicionales según tus necesidades
6. **Implementar manejo de errores** más robusto
7. **Agregar tests** para asegurar la calidad del código
