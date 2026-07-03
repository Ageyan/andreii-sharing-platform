import api from "./api";
import type { Item } from "../types/items.types";
import type { AxiosRequestConfig } from "axios";

export const getItems = async(config? : AxiosRequestConfig): Promise<Item[]> => {
    const { data } = await api.get<Item[]>('/items', config);
    return data;
};

export const getItemById = async( id : number): Promise<Item> => {
    const { data } = await api.get<Item>(`/items/${id}`);
    return data;
}

export const getMyItems = async(config? : AxiosRequestConfig): Promise<Item[]> => {
    const { data } = await api.get<Item[]>('/items/my', config);
    return data;
}

export const deleteItem = async(id: number): Promise<void> => {
    await api.delete(`/items/${id}`);
}