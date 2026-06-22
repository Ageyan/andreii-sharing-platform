import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';

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
                const response = await api.post('/auth/login', {
                    email,
                    password,
                });

                if (response.data && response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    navigate('/dashboard');
                }
            } else {
                const response = await api.post('/auth/register', {
                    name,
                    email,
                    password,
                });

                if (response.status === 200 || response.status === 201) {
                    alert('Реєстрація успішна! Тепер увійдіть у свій аккаунт.');
                    setIsLogin(true);
                    setPassword('');
                }
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message =
                    err.response?.data.message || 'Помилка при вході';
                setError(message);
            } else {
                setError('Сталася непередбачувана помилка');
                console.error('Невідома помилка:', err);
            }
        }
    };

    return (
        <div
            style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}
        >
            <h2>{isLogin ? 'Авторизація' : 'Зареєструватися'}</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form
                onSubmit={handlesSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                }}
            >
                {!isLogin && (
                    <div>
                        <label>Name: </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                )}

                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    style={{ padding: '10px', cursor: 'pointer' }}
                >
                    {isLogin ? 'Ввійти' : 'Реєстрація'}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setError('');
                        setEmail('');
                        setPassword('');
                        setName('');
                        setIsLogin(!isLogin);
                    }}
                >
                    {isLogin
                        ? 'Немає аккаунта? Зареєструйся'
                        : 'Вже є аккаунт? Увійди'}
                </button>
            </form>
        </div>
    );
};

export default AuthPage;
