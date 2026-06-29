import { useParams } from 'react-router-dom';
import { getItemById } from '../services/items';
import { useEffect, useState } from 'react';
import type { Item } from '../types/items.types';
import axios from 'axios';

const ItemPage = () => {
    const [item, setItem] = useState<Item | null>(null);
    const [loader, setLoader] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (!id) return;

        const getItem = async () => {
            setLoader(true);
            setError('');
            try {
                const res = await getItemById(id);
                setItem(res);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const message = err.response?.data.message || 'Помилка при завантаженні товару';
                    setError(message);
                } else {
                    setError('Сталася непередбачувана помилка');
                    console.error('Невідома помилка:', err);
                }
            } finally {
                setLoader(false);
            }
        };

        getItem();
    }, [id]);

    return (
        <div className="item-page">
            {error && <p className="text-error">{error}</p>}
            {loader && <div>Товар завантажується...</div>}

            {!error && !loader && item && (
                <div>
                    <h1>{item.title}</h1>
                    <p>{item.description}</p>
                    <span>ID товара: {id}</span>
                </div>
            )}
        </div>
    );
};

export default ItemPage;
