import {signOut} from "next-auth/react"
export default function SignOutButton () {
    async function signOutSession () {
        await signOut()
    }
    return (
    <button className="rounded-md w-30 text-center bg-red-500 cursor-pointer hover:bg-red-400 duration-300" onClick={signOutSession}>
        Cerrar sesión
    </button>
    )
}