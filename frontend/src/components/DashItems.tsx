import { useEffect, useState } from 'react';
import type { Item } from '../types/items.types';
import { getMyItems, deleteItem } from '../services/items';
import ItemCard from './ItemCard';
import AddItemForm from './AddItemForm';
import axios from 'axios';
import { MdDelete } from 'react-icons/md';

const DashItems = () => {
    const [myItems, setMyItems] = useState<Item[]>([]);
    const [loader, setLoader] = useState<boolean>(false);
    const [viewForm, setViewForm] = useState<boolean>(false);
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
        <div className="dashboard-items">
            {loader && <div>Список речей завантажуеться</div>}
            {error && <p>{error}</p>}
            {viewForm ? (
                <button
                    className="dashboard-items__toggle-btn dashboard-items__toggle-btn--cancel"
                    onClick={() => setViewForm(!viewForm)}
                >
                    Відмінити додавання речі
                </button>
            ) : (
                <button
                    className="dashboard-items__toggle-btn dashboard-items__toggle-btn--add"
                    onClick={() => setViewForm(!viewForm)}
                >
                    Додати нову річ
                </button>
            )}
            <div className={viewForm ? '' : 'dashboard-items__list'}>
                {!error && !loader && viewForm ? (
                    <AddItemForm setViewForm={setViewForm} setMyItems={setMyItems} />
                ) : (
                    myItems.map(i => (
                        <ItemCard key={i.id} item={i}>
                            <button
                                className="item-card__btn-delete"
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDelete(i.id);
                                }}
                            >
                                <MdDelete className="item-card__btn-delete-icon" />
                            </button>
                        </ItemCard>
                    ))
                )}
                {!error && !loader && myItems.length === 0 && !viewForm && (
                    <div>Поки у вас відсутні речі</div>
                )}
            </div>
        </div>
    );
};

export default DashItems;
