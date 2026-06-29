import { create } from "zustand"
import { State, type AuthState } from "@/types/AuthState"
import { decodeUser } from "@/utils/decode-user"
import { api } from "@/lib/api"
import type { AuthResponse } from "@/types/AuthState"

export const useAuth = create<AuthState>((set, get) => ({
    accessToken: null,
    state: State.LOADING,
    user: null,
    login: async (userDTO) => {
        // Let errors throw — the caller (Login page) catches and renders them.
        const { data } = await api.post<AuthResponse>('/user/login', {
            email: userDTO.email,
            password: userDTO.password,
        })
        // Success: persist the token (this also derives `user` and flips state).
        get().setAccessToken(data.accessToken)
    },
    signup: async(signupDTO) => {
        const {data} = await api.post<AuthResponse>('/user/signup', {
            email: signupDTO.email,
            password: signupDTO.password
        })
        get().setAccessToken(data.accessToken)
    },
    setAccessToken: (token) =>
        set({
            accessToken: token,
            user: token ? decodeUser(token) : null,
            state: token ? State.AUTHENTICATED : State.UNAUTHENTICATED
        }),


}))
