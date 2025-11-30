import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Credentials({
    credentials:{
        email:{},
        password:{}
    },
    authorize: async (credentials) => {
        const email = "admin@admin.com"
        const password = "12345678"

        if(credentials.email === email && credentials.password === password) {
            return {email, password}
        } else {
            throw new Error("Credenciales invalidas")
        }
    }
  })],
})