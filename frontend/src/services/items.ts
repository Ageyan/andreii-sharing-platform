import api from "./api";
import type { Item } from "../types/items.types";

export const getItems = async(): Promise<Item[]> => {
    const { data } = await api.get<Item[]>('/items');
    return data;
};