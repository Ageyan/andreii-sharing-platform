export interface UserInfo  {
    id: number;
    name: string;
    email?: string;
    phone: string;
    created_at?: string
}

export type UserUpdateInfo = Omit<UserInfo, 'email' | 'created_at'> 