import api from "./api";
import type { UserInfo, UserUpdateInfo } from "../types/user.types";

export const getUserInfo = async(): Promise<UserInfo> => {
    const { data } = await api.get<UserInfo>('/users/profile');
    return data;
}

export const updateUserInfo = async(name: string, phone: string): Promise<UserInfo> => {
    const { data } = await api.put<UserUpdateInfo>('/users/profile/update', { name,  phone });
    return data;
}