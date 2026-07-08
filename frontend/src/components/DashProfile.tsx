import { useState, useEffect } from 'react';
import { getUserInfo, updateUserInfo } from '../services/user';
import type { UserInfo } from '../types/user.types';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhoneAlt, FaCalendarAlt } from 'react-icons/fa';

const DashProfile = () => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [updateName, setUpdateName] = useState<string>('');
    const [updatePhone, setUpdatePhone] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const getUser = async () => {
            setLoader(true);
            setError('');
            try {
                const res = await getUserInfo();
                setUser(res);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const message =
                        err.response?.data.message || 'Помилка при отриманні даних про користувача';
                    setError(message);
                } else {
                    setError('Сталася непередбачувана помилка');
                    console.error('Невідома помилка:', err);
                }
            } finally {
                setLoader(false);
            }
        };

        getUser();
    }, []);

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleUpdateUser = async () => {
        try {
            const updateUser = await updateUserInfo(updateName, updatePhone);
            setUser(updateUser);
            setIsEditing(false);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message =
                    err.response?.data.message || 'Помилка при отриманні даних про користувача';
                setError(message);
            } else {
                setError('Сталася непередбачувана помилка');
                console.error('Невідома помилка:', err);
            }
        }
    };

    return (
        <div className="dash-profile">
            {error && <p className="dash-profile__error">{error}</p>}
            {loader && (
                <div className="dash-profile__loader">Завантаження даних про користувача...</div>
            )}

            {!error && !loader && user && (
                <div className="dash-profile__card">
                    <div className="dash-profile__header">
                        <div className="dash-profile__avatar-placeholder">
                            {user.name.charAt(0).toUpperCase()}
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
                            <div className="dash-profile__field-value">{user.email}</div>
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
                            <div className="dash-profile__field-value">
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
                                >
                                    Зберегти
                                </button>
                                <button
                                    className="dash-profile__edit-btn"
                                    onClick={() => setIsEditing(false)}
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
                                Редагувати профіль
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashProfile;
