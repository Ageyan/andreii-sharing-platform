import api from "./api";
import type { Item } from "../types/items.types";
import type { AxiosRequestConfig } from "axios";

export const getItems = async(config? : AxiosRequestConfig): Promise<Item[]> => {
    const { data } = await api.get<Item[]>('/items', config);
    return data;
};

export const getItemById = async( id : string): Promise<Item> => {
    const { data } = await api.get<Item>(`/items/${id}`);
    return data;
}