import { useState, useRef } from 'react';
import { updateUserInfo, updateUserAvatar } from '../services/user';
import { useUserInfo } from '../context/UserContext';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhoneAlt, FaCalendarAlt } from 'react-icons/fa';
import Toast from './Toast';
import type { ToastState } from '../types/toast.types';
import Loader from './Loader';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { IoCameraReverse } from 'react-icons/io5';

const DashProfile = () => {
    const [updateName, setUpdateName] = useState<string>('');
    const [updatePhone, setUpdatePhone] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [updateLoader, setUpdateLoader] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
    const inputRef = useRef<HTMLInputElement>(null);
    const { user, setUser, loader, error } = useUserInfo();

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setToast({ show: true, message: 'Завантаження фото...', type: 'success' });

            const newAvatarUrl = await updateUserAvatar(file);

            setUser(prev => (prev ? { ...prev, avatar_url: newAvatarUrl } : null));

            setToast({ show: true, message: 'Фото профілю успішно оновлено!', type: 'success' });
        } catch (err) {
            console.error(err);
            setToast({ show: true, message: 'Помилка при завантаженні фото', type: 'error' });
        }
    };

    const handleUpdateUser = async () => {
        if (updateName.trim() === '') {
            setToast({
                show: true,
                message: 'Введіть ваше імʼя коректно',
                type: 'error',
            });
            return;
        }

        if (updatePhone && updatePhone.trim().length < 9) {
            setToast({
                show: true,
                message: 'Введіть коректний номер телефону',
                type: 'error',
            });
            return;
        }

        setUpdateLoader(true);

        try {
            const updateUser = await updateUserInfo(updateName, updatePhone);
            setUser(updateUser);
            setIsEditing(false);
            setToast({ show: true, message: 'Ви успішно редагували дані!', type: 'success' });
        } catch (err) {
            let errorMessage = 'Сталася непередбачувана помилка';

            if (axios.isAxiosError(err)) {
                errorMessage =
                    err.response?.data.message || 'Помилка при оновленні даних користувача';
            }

            setToast({
                show: true,
                message: errorMessage,
                type: 'error',
            });
        } finally {
            setUpdateLoader(false);
        }
    };

    return (
        <div className="dash-profile">
            {error && (
                <div className="error-banner">
                    <span>⚠️</span> {error}
                </div>
            )}
            {loader && <Loader />}
            {!error && !loader && user && (
                <div className="dash-profile__card">
                    <div className="dash-profile__header">
                        <div
                            onClick={() => inputRef.current?.click()}
                            className="dash-profile__avatar-placeholder"
                        >
                            <div className="dash-profile__avatar-placeholder--back">
                                <IoCameraReverse />
                            </div>
                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAvatarChange}
                            />
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt="User avatar"
                                    style={{ width: '100%', height: '100%' }}
                                />
                            ) : (
                                user.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="dash-profile__meta">
                            <h2 className="dash-profile__username">{user.name}</h2>
                            <p className="dash-profile__status">Орендар / Особистий кабінет</p>
                        </div>
                    </div>
                    <div className="dash-profile__body">
                        <div className="dash-profile__field">
                            <div className="dash-profile__field-label">
                                <FaUser className="dash-profile__field-icon" />
                                <span>Повне імʼя</span>
                            </div>
                            {isEditing ? (
                                <input
                                    className="dash-profile__input-editing"
                                    type="text"
                                    value={updateName}
                                    onChange={e => setUpdateName(e.target.value)}
                                />
                            ) : (
                                <div className="dash-profile__field-value">{user.name}</div>
                            )}
                        </div>
                        <div className="dash-profile__field">
                            <div className="dash-profile__field-label">
                                <FaEnvelope className="dash-profile__field-icon" />
                                <span>Електронна пошта</span>
                            </div>
                            <div
                                className={`dash-profile__field-value ${isEditing ? 'dash-profile__field-value--disabled' : ''}`}
                            >
                                {user.email}
                            </div>
                        </div>
                        <div className="dash-profile__field">
                            <div className="dash-profile__field-label">
                                <FaPhoneAlt className="dash-profile__field-icon" />
                                <span>Номер телефону</span>
                            </div>
                            {isEditing ? (
                                <input
                                    className="dash-profile__input-editing"
                                    type="tel"
                                    value={updatePhone}
                                    onChange={e => setUpdatePhone(e.target.value)}
                                />
                            ) : (
                                <div className="dash-profile__field-value">{user.phone}</div>
                            )}
                        </div>
                        <div className="dash-profile__field">
                            <div className="dash-profile__field-label">
                                <FaCalendarAlt className="dash-profile__field-icon" />
                                <span>Дата реєстрації</span>
                            </div>
                            <div
                                className={`dash-profile__field-value ${isEditing ? 'dash-profile__field-value--disabled' : ''}`}
                            >
                                {formatDate(user.created_at)}
                            </div>
                        </div>
                    </div>
                    <div className="dash-profile__footer">
                        {isEditing ? (
                            <div className="dash-profile__footer-edit-container">
                                <button
                                    className="dash-profile__edit-btn"
                                    onClick={handleUpdateUser}
                                    disabled={updateLoader}
                                >
                                    {updateLoader ? <Loader /> : 'Зберегти'}
                                </button>
                                <button
                                    className="dash-profile__edit-btn dash-profile__edit-btn--cancel"
                                    onClick={() => setIsEditing(false)}
                                    disabled={updateLoader}
                                >
                                    Відмінити
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    setUpdateName(user.name);
                                    setUpdatePhone(user.phone);
                                    setIsEditing(true);
                                }}
                                className="dash-profile__edit-btn"
                            >
                                <MdOutlineManageAccounts className="dash-profile__edit-btn-icon" />{' '}
                                Редагувати профіль
                            </button>
                        )}
                    </div>
                </div>
            )}
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

export default DashProfile;
