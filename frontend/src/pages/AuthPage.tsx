// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { handleLogin, handleRegister } from '../services/auth';
// import { MdAlternateEmail, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
// import { RiLockPasswordLine } from 'react-icons/ri';
// import { FaPhoneAlt } from 'react-icons/fa';

// type ToastState = {
//     show: boolean;
//     message: string;
//     type: 'success' | 'error';
// };

// const AuthPage = () => {
//     const [name, setName] = useState<string>('');
//     const [phone, setPhone] = useState<string>('');
//     const [email, setEmail] = useState<string>('');
//     const [password, setPassword] = useState<string>('');
//     const [error, setError] = useState<string>('');
//     const [isLogin, setIsLogin] = useState<boolean>(true);
//     const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

//     const navigate = useNavigate();
//     const location = useLocation();

//     const handlesSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         setError('');

//         try {
//             if (isLogin) {
//                 const response = await handleLogin(email, password);

//                 if (response && response.token) {
//                     localStorage.setItem('token', response.token);

//                     const fromPage = location.state?.from || '/dashboard';

//                     navigate(fromPage);
//                 }
//             } else {
//                 const response = await handleRegister(name, phone, email, password);

//                 if (response) {
//                     alert('Реєстрація успішна! Тепер увійдіть у свій аккаунт.');
//                     setIsLogin(true);
//                     setPassword('');
//                 }
//             }
//         } catch (err) {
//             if (axios.isAxiosError(err)) {
//                 const message = err.response?.data.message || 'Помилка при вході';
//                 setError(message);
//             } else {
//                 setError('Сталася непередбачувана помилка');
//                 console.error('Невідома помилка:', err);
//             }
//         }
//     };

//     return (
//         <div className="auth-page">
//             <h2 className="auth-page__title">{isLogin ? 'Авторизація' : 'Зареєструватися'}</h2>
//             {error && <p className="auth-page__error">{error}</p>}
//             <form onSubmit={handlesSubmit} className="auth-page__form">
//                 {!isLogin && (
//                     <div className="auth-page__register-container">
//                         <div className="auth-page__input-container">
//                             <label>Name: </label>
//                             <div className="auth-page__input-container--icon">
//                                 <MdOutlineDriveFileRenameOutline className="auth-page__input-icon" />
//                                 <input
//                                     className="auth-page__input"
//                                     type="text"
//                                     value={name}
//                                     onChange={e => setName(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                         </div>
//                         <div className="auth-page__input-container">
//                             <label>Phone: </label>
//                             <div className="auth-page__input-container--icon">
//                                 <FaPhoneAlt className="auth-page__input-icon" />
//                                 <input
//                                     className="auth-page__input"
//                                     type="tel"
//                                     value={phone}
//                                     onChange={e => setPhone(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 )}
//                 <div className="auth-page__input-container">
//                     <label>Email: </label>
//                     <div className="auth-page__input-container--icon">
//                         <MdAlternateEmail className="auth-page__input-icon" />
//                         <input
//                             className="auth-page__input"
//                             type="email"
//                             value={email}
//                             onChange={e => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>
//                 </div>
//                 <div className="auth-page__input-container">
//                     <label>Password: </label>
//                     <div className="auth-page__input-container--icon">
//                         <RiLockPasswordLine className="auth-page__input-icon" />
//                         <input
//                             className="auth-page__input"
//                             type="password"
//                             value={password}
//                             onChange={e => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                 </div>
//                 <button type="submit" className="auth-page__log-btn">
//                     {isLogin ? 'Ввійти' : 'Реєстрація'}
//                 </button>
//                 <button
//                     className="auth-page__change-btn"
//                     type="button"
//                     onClick={() => {
//                         setError('');
//                         setEmail('');
//                         setPassword('');
//                         setName('');
//                         setIsLogin(!isLogin);
//                     }}
//                 >
//                     {isLogin ? 'Немає аккаунта? Зареєструйся' : 'Вже є аккаунт? Увійди'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default AuthPage;

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { handleLogin, handleRegister } from '../services/auth';
import { MdAlternateEmail, MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaPhoneAlt } from 'react-icons/fa';
import Toast from '../components/Toast'; // Не забудь импортировать наш Тост

type ToastState = {
    show: boolean;
    message: string;
    type: 'success' | 'error';
};

const AuthPage = () => {
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

    const navigate = useNavigate();
    const location = useLocation();

    const handlesSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        setToast(prev => ({ ...prev, show: false }));

        try {
            if (isLogin) {
                const response = await handleLogin(email, password);

                if (response && response.token) {
                    localStorage.setItem('token', response.token);
                    const fromPage = location.state?.from || '/dashboard';
                    navigate(fromPage);
                }
            }
            {
                const response = await handleRegister(name, phone, email, password);

                if (response) {
                    setToast({
                        show: true,
                        message: 'Реєстрація успішна! Тепер увійдіть у свій аккаунт.',
                        type: 'success',
                    });
                    setIsLogin(true);
                    setPassword('');
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
        }
    };

    return (
        <div className="auth-page">
            <h2 className="auth-page__title">{isLogin ? 'Авторизація' : 'Зареєструватися'}</h2>
            <form onSubmit={handlesSubmit} className="auth-page__form">
                {!isLogin && (
                    <div className="auth-page__register-container">
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
                        <div className="auth-page__input-container">
                            <label>Phone: </label>
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
