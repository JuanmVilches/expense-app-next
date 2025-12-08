export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  FORM: "/form",
  LIST: "/list",
  API: {
    AUTH: {
      REGISTER: "/api/auth/register",
      SIGNIN: "/api/auth/signin",
      SIGNOUT: "/api/auth/signout",
    },
    EXPENSES: "/api/expenses",
  },
} as const;

export const PROTECTED_ROUTES = [ROUTES.FORM, ROUTES.LIST] as const;
