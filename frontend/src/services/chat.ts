import api from "./api";
import type { CreateChatResponse, GetUserChatsProps } from "../types/chat.types";
import type { AxiosRequestConfig } from "axios";

export const getOrCreateChat = async (itemId: number, ownerId: number): Promise<CreateChatResponse> => {
    const { data } = await api.post<CreateChatResponse>('/chats', { item_id: itemId, owner_id: ownerId });
    return data;
};

export const getUserChats = async (config: AxiosRequestConfig):Promise<GetUserChatsProps[]> => {
    const { data } = await api.get<GetUserChatsProps[]>('/chats', config);
    return data;
}