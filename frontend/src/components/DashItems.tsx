import { useEffect, useState } from 'react';
import type { Item } from '../types/items.types';
import { getMyItems, deleteItem } from '../services/items';
import ItemCard from './ItemCard';
import axios from 'axios';

const DashItems = () => {
    const [myItems, setMyItems] = useState<Item[]>([]);
    const [loader, setLoader] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const controller = new AbortController();
        const getListMyItems = async () => {
            setLoader(true);
            try {
                const res = await getMyItems({ signal: controller.signal });
                setMyItems(res);
            } catch (err) {
                if (axios.isCancel(err)) {
                    return;
                }

                if (axios.isAxiosError(err)) {
                    const message =
                        err.response?.data.message || 'Помилка при отриманні списку ваших речей';
                    setError(message);
                } else {
                    setError('Сталася непередбачувана помилка');
                    console.error('Невідома помилка:', err);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoader(false);
                }
            }
        };

        getListMyItems();

        return () => controller.abort();
    }, []);

    const handleDelete = async (id: number): Promise<void> => {
        try {
            await deleteItem(id);

            setMyItems(prevItems => prevItems.filter(i => i.id !== id));
        } catch (err) {
            setError('Не вдалося видалити річ');
            console.error(err);
        }
    };

    return (
        <div className="dashboard-profile">
            {loader && <div>Список речей завантажуеться</div>}
            {error && <p>{error}</p>}
            {!error &&
                !loader &&
                myItems.map(i => (
                    <ItemCard key={i.id} item={i}>
                        <button
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDelete(i.id);
                            }}
                        >
                            Видалити
                        </button>
                    </ItemCard>
                ))}
            {!error && !loader && myItems.length === 0 && <div>Поки у вас відсутні речі</div>}
        </div>
    );
};

export default DashItems;
