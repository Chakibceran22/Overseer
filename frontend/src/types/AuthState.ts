import type {User, UserDTO} from './User'


export const State = {
    LOADING: 'loading',
    AUTHENTICATED: 'authenticated',
    UNAUTHENTICATED: 'unauthenticated',
} as const

export type State = (typeof State)[keyof typeof State]

export type AuthState = {
    accessToken : string | null
    user: User | null
    state: State
    login: (userDTO: UserDTO) => Promise<void>
    setAccessToken: (token: string | null) => void
    // logout: () => Promise<void>
    signup: (signupDTO: UserDTO) => Promise<void>

}


export type AuthResponse = {
    accessToken: string
    success: boolean
    message: string
}
