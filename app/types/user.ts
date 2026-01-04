import type { Session } from "next-auth";

export interface User {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
}

export type SafeUser = Omit<User, 'password'>

export interface UserSession extends Session {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RegisterPayload {
  email: string;
  name: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
