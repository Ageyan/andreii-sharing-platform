import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getItemById } from '../services/items';
import { createBooking } from '../services/booking';
import { useEffect, useState } from 'react';
import type { Item } from '../types/items.types';
import axios from 'axios';
import Toast from '../components/Toast';
import type { ToastState } from '../types/toast.types';

const ItemPage = () => {
    const [item, setItem] = useState<Item | null>(null);
    const [loader, setLoader] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [imageActive, setImageActive] = useState<string>('');
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
    const isAuthenticated = !!localStorage.getItem('token');

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const fallbackImage =
        'https://wezom.com.ua/Media/filemanager/blog/struktura-internet-magazina-klyuchevye-momenty-sozdaniya/original/rEd1gfWUQnNVLIM0caWoMcl8aDVQ27G6372YEQYQ.jpg';
    const itemImage = item?.image_url?.[0] || fallbackImage;

    useEffect(() => {
        if (!id) return;

        const getItem = async () => {
            setLoader(true);
            setError('');
            try {
                const res = await getItemById(Number(id));
                setItem(res);
                setImageActive(res?.image_url?.[0] || fallbackImage);
            } catch (err) {
                let errorMessage = 'Сталася непередбачувана помилка';

                if (axios.isAxiosError(err)) {
                    errorMessage = err.response?.data.message || 'Помилка при завантаженні товару';
                } else {
                    console.error('Невідома помилка:', err);
                }

                setError(errorMessage);
            } finally {
                setLoader(false);
            }
        };

        getItem();
    }, [id]);

    const authNavigate = () => {
        navigate('/auth', { state: { from: location.pathname } });
    };

    const imagesGallery =
        Array.isArray(item?.image_url) && item.image_url.length > 0
            ? item.image_url
            : [
                  itemImage,
                  'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=200&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=200&auto=format&fit=crop',
              ];

    const getNextDay = (dateString: string) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = getNextDay(today);

    const [startDate, setStartDate] = useState<string>(today);
    const [endDate, setEndDate] = useState<string>(tomorrow);

    const startBooking = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalPrice = totalDays * Number(item!.price_per_day);
        try {
            await createBooking(item!.id, startDate, endDate, totalPrice);
            setToast({
                show: true,
                message: 'Запит на оренду надіслано! Очікуйте на підтвердження від власника',
                type: 'success',
            });
        } catch (err) {
            const errorMessage = 'Сталася непередбачувана помилка';
            if (axios.isAxiosError(err)) {
                const message =
                    err.response?.data.message || 'Помилка при отриманні даних про користувача';
                setError(message);
            }

            setToast({
                show: true,
                message: errorMessage,
                type: 'error',
            });
        }
    };

    return (
        <div className="item-page">
            {error && <p>Помилка при завантаженні сторінки</p>}
            {loader && <div>Сторінка завантажується...</div>}
            {!loader && !error && item && (
                <>
                    <button className="item-page__back-btn" onClick={() => navigate(-1)}>
                        &larr; Назад до каталогу
                    </button>
                    <div className="item-page__layout">
                        <div className="item-page__main-content">
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
                                <span className="item-page__category">{item?.category}</span>
                                <h1 className="item-page__title">{item?.title}</h1>
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
                        <div className="item-page__sidebar">
                            <div className="item-page__widget">
                                <div className="item-page__price-block">
                                    <span className="item-page__price-label">Вартість оренди:</span>
                                    <p className="item-page__price">
                                        <strong>{item?.price_per_day}</strong> грн / доба
                                    </p>
                                </div>
                                <form className="item-page__form" onSubmit={startBooking}>
                                    <div className="item-page__input-group">
                                        <label className="item-page__label">Початок оренди</label>
                                        <input
                                            type="date"
                                            className="item-page__date-input"
                                            value={startDate}
                                            min={today}
                                            onChange={e => {
                                                const newStartDate = e.target.value;
                                                setStartDate(newStartDate);
                                                const nextDayForEnd = getNextDay(newStartDate);
                                                setEndDate(nextDayForEnd);
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="item-page__input-group">
                                        <label className="item-page__label">Кінець оренди</label>
                                        <input
                                            type="date"
                                            className="item-page__date-input"
                                            value={endDate}
                                            min={getNextDay(startDate)}
                                            onChange={e => setEndDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {isAuthenticated ? (
                                        <button type="submit" className="item-page__action-btn">
                                            Орендувати зараз
                                        </button>
                                    ) : (
                                        <button
                                            onClick={authNavigate}
                                            type="button"
                                            className="item-page__action-btn"
                                        >
                                            Увійти для оренди
                                        </button>
                                    )}
                                </form>
                                <p className="item-page__widget-note">
                                    {isAuthenticated
                                        ? `* Ви зможете скасувати бронь безкоштовно за 24 години до початку
                                    оренди.`
                                        : `* Для орендування необхідно здійснити вхід у особистий кабінет`}
                                </p>
                            </div>
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
        </div>
    );
};

export default ItemPage;
