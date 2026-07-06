import api from "./api";
import type { UserInfo } from "../types/user.types";

export const getUserInfo = async(): Promise<UserInfo> => {
    const { data } = await api.get<UserInfo>('/users/profile');
    return data;
}