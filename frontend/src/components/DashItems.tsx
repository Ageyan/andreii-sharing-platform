import { useEffect, useState } from 'react';
import type { Item } from '../types/items.types';
import { getMyItems, deleteItem } from '../services/items';
import ItemCard from './ItemCard';
import ProfileItemForm from './ProfileItemForm';
import axios from 'axios';
import { MdDelete } from 'react-icons/md';
import { MdModeEdit } from 'react-icons/md';
import Toast from './Toast';
import type { ToastState } from '../types/toast.types';
import Loader from './Loader';

const DashItems = () => {
    const [myItems, setMyItems] = useState<Item[]>([]);
    const [loader, setLoader] = useState<boolean>(false);
    const [viewForm, setViewForm] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [error, setError] = useState<string>('');
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
    const [deletingId, setDeletingId] = useState<number | null>(null);

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
        setDeletingId(id);
        try {
            await deleteItem(id);

            setMyItems(prevItems => prevItems.filter(i => i.id !== id));
            setToast({ show: true, message: 'Річ успішно видалена!', type: 'success' });
        } catch (err) {
            let errorMessage = 'Сталася непередбачувана помилка';

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data.message || 'Помилка при видаленні речі';
            }

            setToast({
                show: true,
                message: errorMessage,
                type: 'error',
            });
        } finally {
            setDeletingId(null);
        }
    };

    const handleClose = () => {
        setViewForm(false);
        setEditingItem(null);
    };

    return (
        <div className="dashboard-items">
            <div className="dashboard-items__tabs">
                {viewForm ? (
                    <button
                        className="dashboard-items__toggle-btn dashboard-items__toggle-btn--cancel"
                        onClick={handleClose}
                    >
                        {editingItem ? 'Відмінити редагування речі' : 'Відмінити додавання речі'}
                    </button>
                ) : (
                    <button
                        className="dashboard-items__toggle-btn dashboard-items__toggle-btn--add"
                        onClick={() => setViewForm(true)}
                    >
                        Додати нову річ
                    </button>
                )}
            </div>
            <div className={viewForm ? '' : 'dashboard-items__list'}>
                {loader && <Loader />}
                {error && (
                    <div className="error-banner">
                        <span>⚠️</span> {error}
                    </div>
                )}
                {!error && !loader && viewForm ? (
                    <ProfileItemForm
                        setViewForm={setViewForm}
                        setMyItems={setMyItems}
                        editingItem={editingItem ? editingItem : null}
                        setEditingItem={setEditingItem}
                        setParentToast={setToast}
                    />
                ) : (
                    myItems.map(i => {
                        const isDeleting = deletingId === i.id;
                        return (
                            <ItemCard key={i.id} item={i}>
                                <div className="item-card__btn-container">
                                    <button
                                        className="item-card__btn-edit"
                                        disabled={deletingId !== null}
                                        onClick={e => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setEditingItem(i);
                                            setViewForm(true);
                                        }}
                                    >
                                        <MdModeEdit className="item-card__btn-edit-icon" />
                                    </button>
                                    <button
                                        className={`item-card__btn-delete ${isDeleting ? 'item-card__btn-delete--loading' : ''}`}
                                        disabled={deletingId !== null}
                                        onClick={e => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDelete(i.id);
                                        }}
                                    >
                                        <MdDelete className="item-card__btn-delete-icon" />
                                    </button>
                                </div>
                            </ItemCard>
                        );
                    })
                )}
                {!error && !loader && myItems.length === 0 && !viewForm && (
                    <div className="empty-state">
                        <span className="empty-state__icon">📦</span>
                        <p>Поки у вас відсутні речі</p>
                    </div>
                )}
            </div>
            {toast.show && (
                <Toast
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                    message={toast.message}
                    type={toast.type}
                />
            )}
        </div>
    );
};

export default DashItems;
