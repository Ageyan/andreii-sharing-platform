import { useParams, useNavigate } from 'react-router-dom';
import { getItemById } from '../services/items';
import { useEffect, useState } from 'react';
import type { Item } from '../types/items.types';
import axios from 'axios';
import Toast from '../components/Toast';
import type { ToastState } from '../types/toast.types';
import Loader from '../components/Loader';
import ItemPageSidebar from '../components/ItemPageSidebar';

const ItemPage = () => {
    const [item, setItem] = useState<Item | null>(null);
    const [loader, setLoader] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [imageActive, setImageActive] = useState<string>('');
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const fallbackImage =
        'https://wezom.com.ua/Media/filemanager/blog/struktura-internet-magazina-klyuchevye-momenty-sozdaniya/original/rEd1gfWUQnNVLIM0caWoMcl8aDVQ27G6372YEQYQ.jpg';
    const itemImage = item?.image_url?.[0] || fallbackImage;

    useEffect(() => {
        if (!id) return;
        const controller = new AbortController();

        const getItem = async () => {
            setLoader(true);
            setError('');
            try {
                const res = await getItemById(Number(id), { signal: controller.signal });
                setItem(res);
                setImageActive(res?.image_url?.[0] || fallbackImage);
            } catch (err) {
                let errorMessage = 'Сталася непередбачувана помилка';

                if (axios.isCancel(err)) {
                    return;
                }

                if (axios.isAxiosError(err)) {
                    errorMessage = err.response?.data.message || 'Помилка при завантаженні товару';
                } else {
                    console.error('Невідома помилка:', err);
                }

                setError(errorMessage);
            } finally {
                if (!controller.signal.aborted) {
                    setLoader(false);
                }
            }
        };

        getItem();

        return () => controller.abort();
    }, [id]);

    useEffect(() => {
        const container = document.querySelector('.app-container');

        container!.classList.add('has-mobile-fixed-bar');

        return () => {
            container!.classList.remove('has-mobile-fixed-bar');
        };
    }, []);

    const imagesGallery =
        Array.isArray(item?.image_url) && item.image_url.length > 0
            ? item.image_url
            : [
                  itemImage,
                  'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=200&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=200&auto=format&fit=crop',
              ];

    return (
        <div className="item-page">
            {loader && <Loader />}
            {error && (
                <div className="error-banner">
                    <span>⚠️</span> {error}
                </div>
            )}
            {!loader && !error && item && (
                <>
                    <button className="item-page__back-btn" onClick={() => navigate(-1)}>
                        &larr; Назад до каталогу
                    </button>
                    <div className="item-page__layout">
                        <div className="item-page__main-content">
                            <div className="item-page__title-info">
                                <h1 className="item-page__title">{item?.title}</h1>
                                <span className="item-page__category">{item?.category}</span>
                            </div>
                            <div className="item-page__gallery">
                                <div className="item-page__main-img-wrapper">
                                    <img
                                        src={imageActive || itemImage}
                                        alt={item?.title}
                                        className="item-page__main-img"
                                    />
                                </div>
                                <div className="item-page__thumbs">
                                    {imagesGallery.map((imgUrl, index) => (
                                        <div
                                            key={index}
                                            className={`item-page__thumb-item ${imageActive === imgUrl ? 'item-page__thumb-item--active' : ''}`}
                                            onClick={() => setImageActive(imgUrl)}
                                        >
                                            <img src={imgUrl} alt={`Прев'ю ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="item-page__info-block">
                                <div className="item-page__owner">
                                    <div className="item-page__owner-avatar">A</div>
                                    <div className="item-page__owner-info">
                                        <p className="item-page__owner-name">
                                            Власник: {item?.owner_name}
                                        </p>
                                        <p className="item-page__owner-status">
                                            На платформі з 2026 року
                                        </p>
                                    </div>
                                </div>
                                <hr className="item-page__divider" />
                                <div className="item-page__description-wrapper">
                                    <h3 className="item-page__section-title">Опис речі</h3>
                                    <p className="item-page__description">{item?.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="item-page__desktop-sidebar">
                            <ItemPageSidebar item={item} setToast={setToast} />
                        </div>
                    </div>
                </>
            )}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                >
                    {toast.type === 'success' && (
                        <button
                            className="toast__link-btn"
                            onClick={() => navigate('/dashboard/bookings')}
                        >
                            Перейти до кабінету &rarr;
                        </button>
                    )}
                </Toast>
            )}
            {!loader && !error && item && (
                <div className="item-page__mobile-desk">
                    <div>
                        <span>Вартість оренди:</span>
                        <p>
                            <strong>{item?.price_per_day}</strong> грн / доба
                        </p>
                    </div>
                    <button
                        className="item-page__mobile-rent-btn"
                        onClick={() => setModalOpen(true)}
                    >
                        Орендувати
                    </button>
                </div>
            )}
            {modalOpen && (
                <div className="item-page__mobile-backdrop" onClick={() => setModalOpen(false)}>
                    <div className="item-page__mobile-modal" onClick={e => e.stopPropagation()}>
                        <div className="item-page__mobile-modal-header">
                            <h3>Оформлення оренди</h3>
                            <button
                                className="item-page__close-modal"
                                onClick={() => setModalOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <ItemPageSidebar item={item} setToast={setToast} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemPage;
