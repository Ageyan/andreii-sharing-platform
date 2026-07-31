import api from "./api";
import type { CreateChatResponse, GetUserChatsProps, GetUserMessage } from "../types/chat.types";
import type { AxiosRequestConfig } from "axios";

export const getOrCreateChat = async (itemId: number, ownerId: number): Promise<CreateChatResponse> => {
    const { data } = await api.post<CreateChatResponse>('/chats', { item_id: itemId, owner_id: ownerId });
    return data;
};

export const getUserChats = async (config: AxiosRequestConfig):Promise<GetUserChatsProps[]> => {
    const { data } = await api.get<GetUserChatsProps[]>('/chats', config);
    return data;
}

export const getUserMessages = async (chatId: number, config: AxiosRequestConfig): Promise<GetUserMessage[]> => {
    const { data } = await api.get<GetUserMessage[]>(`/chats/${chatId}/messages`, config);
    return data;
}

export const getUnreadMessages = async (config: AxiosRequestConfig): Promise<number> => {
    const { data } = await api.get<number>('/chats/messages/unread', config);
    return data;
}

export const updateStatusMessage = async (chatId: number): Promise<void> => {
    await api.patch(`chats/${chatId}/messages/read`);
}