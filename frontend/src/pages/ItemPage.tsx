import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import type { Item } from '../types/items.types';
import type { ToastState } from '../types/toast.types';
import { getItemById } from '../services/items';
import { getOrCreateChat } from '../services/chat';
import { useUserInfo } from '../context/UserContext';

import Toast from '../components/common/Toast';
import Loader from '../components/common/Loader';
import ItemPageSidebar from '../components/item/ItemPageSidebar';

import { BsFillChatDotsFill } from 'react-icons/bs';

const ItemPage = () => {
    const [item, setItem] = useState<Item | null>(null);
    const [loader, setLoader] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [imageActive, setImageActive] = useState<string>('');
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const isAuthenticated = !!localStorage.getItem('token');
    const { user } = useUserInfo();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const myItem = user?.id === item?.owner_id;
    const isDisable = !isAuthenticated || myItem;
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

    const imagesGallery =
        Array.isArray(item?.image_url) && item.image_url.length > 0
            ? item.image_url
            : [
                  itemImage,
                  'https://ap-verlag.de/clickandbuilds/WordPress/MyCMS4/wp-content/uploads/2018/11/foto-cc0-pixabay-tumisu-iot-internet-der-dinge.jpg',
                  'https://edge.inloox.com/var/corporate_site/storage/images/media/images/blog/projektmanagement-und-das-internet-der-dinge-header/1182708-1-ger-DE/projektmanagement-und-das-internet-der-dinge-header.png',
              ];

    const handleChat = async () => {
        if (!item) return;

        const chatData = await getOrCreateChat(item.id, item.owner_id);
        navigate('/dashboard/chats', {
            state: { from: location.pathname, activeChatId: chatData.id },
        });
    };

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
                                        draggable="false"
                                    />
                                </div>
                                <div className="item-page__thumbs">
                                    {imagesGallery.map((imgUrl, index) => (
                                        <div
                                            key={index}
                                            className={`item-page__thumb-item ${imageActive === imgUrl ? 'item-page__thumb-item--active' : ''}`}
                                            onClick={() => setImageActive(imgUrl)}
                                        >
                                            <img
                                                src={imgUrl}
                                                alt={`Прев'ю ${index + 1}`}
                                                draggable="false"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="item-page__info-block">
                                <div className="item-page__owner">
                                    <div className="item-page__owner-avatar">
                                        {item?.owner_avatar ? (
                                            <img
                                                src={item.owner_avatar}
                                                alt={item.owner_name || 'Owner'}
                                                style={{ width: '100%', height: '100%' }}
                                                draggable="false"
                                            />
                                        ) : (
                                            item?.owner_name?.charAt(0).toUpperCase() || 'U'
                                        )}
                                    </div>
                                    <div className="item-page__owner-info">
                                        <p className="item-page__owner-name">
                                            Власник: {item?.owner_name}
                                        </p>
                                        <p className="item-page__owner-status">
                                            На платформі з 2026 року
                                        </p>
                                    </div>
                                    <button
                                        className={`item-page__owner-chat ${isDisable ? '' : 'active'}`}
                                        onClick={handleChat}
                                        disabled={isDisable}
                                    >
                                        <BsFillChatDotsFill
                                            className={`item-page__chat-icon ${isDisable ? '' : 'active'} `}
                                        />
                                    </button>
                                </div>
                                <hr className="item-page__divider" />
                                <div className="item-page__description-wrapper">
                                    <h3 className="item-page__section-title">Опис речі</h3>
                                    <p className="item-page__description">{item?.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="item-page__desktop-sidebar">
                            <ItemPageSidebar
                                item={item}
                                setToast={setToast}
                                isAuthenticated={isAuthenticated}
                                myItem={myItem}
                            />
                        </div>
                    </div>
                </>
            )}
            <Toast
                show={toast.show}
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
            <div
                className={`item-page__mobile-backdrop ${modalOpen ? 'show' : ''}`}
                onClick={() => setModalOpen(false)}
            >
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
                    <ItemPageSidebar
                        item={item}
                        setToast={setToast}
                        isAuthenticated={isAuthenticated}
                        myItem={myItem}
                    />
                </div>
            </div>
        </div>
    );
};

export default ItemPage;
