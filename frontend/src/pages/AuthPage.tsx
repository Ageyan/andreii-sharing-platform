import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { handleLogin, handleRegister } from '../services/auth';
import { MdAlternateEmail, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaPhoneAlt } from 'react-icons/fa';
import Toast from '../components/Toast';
import type { ToastState } from '../types/toast.types';
import Loader from '../components/Loader';

const AuthPage = () => {
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [loader, setLoader] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

    const navigate = useNavigate();
    const location = useLocation();

    const handlesSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setToast(prev => ({ ...prev, show: false }));
        setLoader(true);

        try {
            if (isLogin) {
                const response = await handleLogin(email, password);

                if (response && response.token) {
                    localStorage.setItem('token', response.token);
                    const fromPage = location.state?.from || '/dashboard/profile';
                    navigate(fromPage);
                }
            } else {
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
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )}
        </div>
    );
};

export default AuthPage;
