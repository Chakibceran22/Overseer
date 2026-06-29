import type {User} from '@/types/User'


export function decodeUser(token: string): User | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    const payload = JSON.parse(atob(base64))
    return { id: payload.sub ?? payload.id, email: payload.email }
  } catch {
    return null
  }
}
