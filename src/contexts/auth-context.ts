import { createContext, useContext } from "react"
import type { Session, User } from "@supabase/supabase-js"

export type AuthContextType = {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{
    error: Error | null
    success: boolean
  }>
  signUp: (email: string, password: string) => Promise<{
    error: Error | null
    success: boolean
  }>
  signInWithGoogle: (credential: string) => Promise<{
    error: Error | null
    success: boolean
  }>
  signInWithGitHub: () => Promise<{
    error: Error | null
    success: boolean
  }>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
