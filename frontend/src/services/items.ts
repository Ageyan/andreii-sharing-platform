import api from "./api";
import type { Item, CreateItem } from "../types/items.types";
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

export const addItem = async(itemData: CreateItem, files: File[]): Promise<Item> => {
    const formData = new FormData();

    formData.append('title', itemData.title);
    formData.append('description', itemData.description);
    formData.append('price_per_day', String(itemData.price_per_day));
    formData.append('category', itemData.category);

    files.forEach(file => {
        formData.append('images', file);
    })

    const { data } = await api.post('/items/add', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return data.item;
}

export const deleteItem = async(id: number): Promise<void> => {
    await api.delete(`/items/${id}`);
}