import api from "./api";
import type { LoginResponse, RegisterResponse } from "../types/auth.types";

export const handleLogin = async(email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    return data;
}

export const handleRegister = async(name: string, email: string, password: string): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>('/auth/register', { name, email, password });
    return data;
};
