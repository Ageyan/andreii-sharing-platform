import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleLogin, handleRegister } from '../services/auth';
import { MdAlternateEmail, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';

const AuthPage = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [name, setName] = useState<string>('');

    const navigate = useNavigate();

    const handlesSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        try {
            if (isLogin) {
                const response = await handleLogin(email, password);

                if (response && response.token) {
                    localStorage.setItem('token', response.token);
                    navigate('/dashboard');
                }
            } else {
                const response = await handleRegister(name, email, password);

                if (response) {
                    alert('Реєстрація успішна! Тепер увійдіть у свій аккаунт.');
                    setIsLogin(true);
                    setPassword('');
                }
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data.message || 'Помилка при вході';
                setError(message);
            } else {
                setError('Сталася непередбачувана помилка');
                console.error('Невідома помилка:', err);
            }
        }
    };

    return (
        <div className="auth-page">
            <h2 className="auth-page__title">{isLogin ? 'Авторизація' : 'Зареєструватися'}</h2>
            {error && <p className="auth-page__error">{error}</p>}
            <form onSubmit={handlesSubmit} className="auth-page__form">
                {!isLogin && (
                    <div className="auth-page__input-container">
                        <label>Name: </label>
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
                )}
                <div className="auth-page__input-container">
                    <label>Email: </label>
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
                    <label>Password: </label>
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
                <button type="submit" className="auth-page__log-btn">
                    {isLogin ? 'Ввійти' : 'Реєстрація'}
                </button>
                <button
                    className="auth-page__change-btn"
                    type="button"
                    onClick={() => {
                        setError('');
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
    );
};

export default AuthPage;
