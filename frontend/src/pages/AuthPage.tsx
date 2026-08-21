import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { handleLogin, handleRegister } from '../services/auth';
import { MdAlternateEmail, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaPhoneAlt } from 'react-icons/fa';
import Toast from '../components/common/Toast';
import type { ToastState } from '../types/toast.types';
import { useUserInfo } from '../context/UserContext';
import { getUserInfo } from '../services/user';
import Loader from '../components/common/Loader';

const AuthPage = () => {
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [loader, setLoader] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
    const { setUser } = useUserInfo();

    const navigate = useNavigate();
    const location = useLocation();

    const handlesSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setToast(prev => ({ ...prev, show: false }));

        try {
            if (isLogin) {
                if (!email.trim() || !password.trim()) {
                    setToast({
                        show: true,
                        message: 'Будь ласка, заповніть всі поля',
                        type: 'error',
                    });
                    return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    setToast({
                        show: true,
                        message: 'Введіть коректний email (наприклад: user@mail.com)',
                        type: 'error',
                    });
                    return;
                }

                if (password.length < 4) {
                    setToast({
                        show: true,
                        message: 'Пароль має містити щонайменше 6 символів',
                        type: 'error',
                    });
                    return;
                }

                setLoader(true);
                const response = await handleLogin(email, password);

                if (response && response.token) {
                    localStorage.setItem('token', response.token);
                    const fromPage = location.state?.from || '/dashboard/profile';
                    const userData = await getUserInfo();
                    setUser(userData);
                    navigate(fromPage);
                }
            } else {
                if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
                    setToast({
                        show: true,
                        message: 'Будь ласка, заповніть всі поля',
                        type: 'error',
                    });
                    return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    setToast({
                        show: true,
                        message: 'Введіть коректний email (наприклад: user@mail.com)',
                        type: 'error',
                    });
                    return;
                }

                const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
                if (!phoneRegex.test(phone)) {
                    setToast({
                        show: true,
                        message: 'Введіть коректний номер телефону (мінімум 10 цифр)',
                        type: 'error',
                    });
                    return;
                }

                if (password.length < 6) {
                    setToast({
                        show: true,
                        message: 'Пароль має містити щонайменше 6 символів',
                        type: 'error',
                    });
                    return;
                }

                setLoader(true);
                const response = await handleRegister(name, phone, email, password);

                if (response) {
                    setToast({
                        show: true,
                        message: 'Реєстрація успішна! Тепер увійдіть у свій аккаунт.',
                        type: 'success',
                    });
                    setIsLogin(true);
                    setPassword('');
                    setName('');
                    setPhone('');
                }
            }
        } catch (err) {
            let errorMessage = 'Сталася непередбачувана помилка';
            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data.message || 'Помилка при вході';
            } else {
                console.error('Невідома помилка:', err);
            }
            setToast({
                show: true,
                message: errorMessage,
                type: 'error',
            });
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-page__container">
                <h2 className="auth-page__title">{isLogin ? 'Авторизація' : 'Зареєструватися'}</h2>
                <form onSubmit={handlesSubmit} className="auth-page__form">
                    {!isLogin && (
                        <div className="auth-page__register-container">
                            <div className="auth-page__input-container">
                                <label>Імʼя: </label>
                                <div className="auth-page__input-container--icon">
                                    <MdOutlineDriveFileRenameOutline className="auth-page__input-icon" />
                                    <input
                                        className="auth-page__input"
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="auth-page__input-container">
                                <label>Телефон: </label>
                                <div className="auth-page__input-container--icon">
                                    <FaPhoneAlt className="auth-page__input-icon" />
                                    <input
                                        className="auth-page__input"
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="auth-page__input-container">
                        <label>Електронна пошта: </label>
                        <div className="auth-page__input-container--icon">
                            <MdAlternateEmail className="auth-page__input-icon" />
                            <input
                                className="auth-page__input"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="auth-page__input-container">
                        <label>Пароль: </label>
                        <div className="auth-page__input-container--icon">
                            <RiLockPasswordLine className="auth-page__input-icon" />
                            <input
                                className="auth-page__input"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="auth-page__log-btn" disabled={loader}>
                        {loader ? <Loader /> : isLogin ? 'Ввійти' : 'Реєстрація'}
                    </button>
                    <button
                        className="auth-page__change-btn"
                        type="button"
                        disabled={loader}
                        onClick={() => {
                            setToast(prev => ({ ...prev, show: false }));
                            setEmail('');
                            setPassword('');
                            setName('');
                            setIsLogin(!isLogin);
                        }}
                    >
                        {isLogin ? 'Немає аккаунта? Зареєструйся' : 'Вже є аккаунт? Увійди'}
                    </button>
                </form>
            </div>
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
            />
        </div>
    );
};

export default AuthPage;
