export interface LoginResponse {
    token: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

export interface RegisterResponse {
    message: string;
    user?: User;
}