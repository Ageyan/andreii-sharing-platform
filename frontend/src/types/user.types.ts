export interface UserInfo  {
    id: number;
    name: string;
    email?: string;
    phone: string;
    created_at?: string;
    avatar_url?: string;
}

export type UserUpdateInfo = Omit<UserInfo, 'email' | 'created_at'> 