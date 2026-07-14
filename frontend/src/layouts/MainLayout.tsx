import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface TawkWindow extends Window {
    Tawk_API?: {
        hideWidget?: () => void;
        showWidget?: () => void;
        onLoad?: () => void;
        [key: string]: unknown;
    };
    Tawk_LoadStart?: Date;
}

const MainLayout = () => {
    const location = useLocation();

    useEffect(() => {
        const tawkWindow = window as unknown as TawkWindow;

        if (document.getElementById('tawk-chat-script')) return;

        tawkWindow.Tawk_API = tawkWindow.Tawk_API || {};
        tawkWindow.Tawk_LoadStart = new Date();

        const apiKey = import.meta.env.VITE_TAWK_API_KEY;
        if (!apiKey) {
            console.error('Переменная VITE_TAWK_API_KEY не найдена в файле .env');
            return;
        }

        const script = document.createElement('script');
        script.async = true;
        script.src = apiKey;
        script.setAttribute('crossorigin', '*');
        script.id = 'tawk-chat-script';
        script.setAttribute('charset', 'UTF-8');

        const firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(script, firstScript);
        } else {
            document.body.appendChild(script);
        }
    }, []);

    useEffect(() => {
        const tawkWindow = window as unknown as TawkWindow;

        const handleVisibility = () => {
            if (tawkWindow.Tawk_API?.hideWidget && tawkWindow.Tawk_API?.showWidget) {
                if (location.pathname === '/auth') {
                    tawkWindow.Tawk_API.hideWidget();

                    if (typeof tawkWindow.Tawk_API.endChat === 'function') {
                        tawkWindow.Tawk_API.endChat();
                    }
                } else {
                    tawkWindow.Tawk_API.showWidget();
                }
            }
        };

        handleVisibility();

        if (tawkWindow.Tawk_API) {
            tawkWindow.Tawk_API.onLoad = handleVisibility;
        }
    }, [location.pathname]);

    return (
        <div className="app-container">
            <Header />
            <main className="main-container">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;

// import { Outlet, useLocation } from 'react-router-dom';
// import { useEffect } from 'react';
// import Header from '../components/Header';
// import Footer from '../components/Footer';

// type TawkMessage = string | { message?: string; attachments?: unknown[] };

// interface TawkWindow extends Window {
//     Tawk_API?: {
//         hideWidget?: () => void;
//         showWidget?: () => void;
//         onLoad?: () => void;
//         onChatMessageVisitor?: (message: TawkMessage) => void; // Використовуємо новий тип
//         [key: string]: unknown;
//     };
//     Tawk_LoadStart?: Date;
// }

// const MainLayout = () => {
//     const location = useLocation();

//     // 1. Инициализация виджета Tawk.to
//     useEffect(() => {
//         const tawkWindow = window as unknown as TawkWindow;

//         if (document.getElementById('tawk-chat-script')) return;

//         tawkWindow.Tawk_API = tawkWindow.Tawk_API || {};
//         tawkWindow.Tawk_LoadStart = new Date();

//         const apiKey = import.meta.env.VITE_TAWK_API_KEY;
//         if (!apiKey) {
//             console.error('Переменная VITE_TAWK_API_KEY не найдена в файле .env');
//             return;
//         }

//         const script = document.createElement('script');
//         script.async = true;
//         script.src = apiKey;
//         script.setAttribute('crossorigin', '*');
//         script.id = 'tawk-chat-script';
//         script.setAttribute('charset', 'UTF-8');

//         const firstScript = document.getElementsByTagName('script')[0];
//         if (firstScript && firstScript.parentNode) {
//             firstScript.parentNode.insertBefore(script, firstScript);
//         } else {
//             document.body.appendChild(script);
//         }
//     }, []);

//     // 2. Управление видимостью и ПРЯМОЙ перехват сообщений
//     useEffect(() => {
//         const tawkWindow = window as unknown as TawkWindow;

//         const handleVisibility = () => {
//             if (tawkWindow.Tawk_API?.hideWidget && tawkWindow.Tawk_API?.showWidget) {
//                 if (location.pathname === '/auth') {
//                     tawkWindow.Tawk_API.hideWidget();
//                     if (typeof tawkWindow.Tawk_API.endChat === 'function') {
//                         tawkWindow.Tawk_API.endChat();
//                     }
//                 } else {
//                     tawkWindow.Tawk_API.showWidget();
//                 }
//             }
//         };

//         handleVisibility();

//         if (tawkWindow.Tawk_API) {
//             tawkWindow.Tawk_API.onLoad = handleVisibility;

//             // ХУК НА ОТПРАВКУ СООБЩЕНИЯ ПОЛЬЗОВАТЕЛЕМ
//             tawkWindow.Tawk_API.onChatMessageVisitor = async function (message: TawkMessage) {
//                 // Тепер TypeScript розуміє, що message може бути об'єктом із властивістю message
//                 const messageText = typeof message === 'string' ? message : message?.message || '';

//                 console.log('Фронтенд зловив повідомлення:', messageText);

//                 if (!messageText) {
//                     console.warn('Повідомлення порожнє, відправку на бекенд скасовано.');
//                     return;
//                 }

//                 try {
//                     const response = await fetch('http://localhost:8000/api/chat-bot', {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({
//                             event: 'chatMessageReceived',
//                             message: {
//                                 sender: { type: 'visitor' },
//                                 text: messageText, // Наш витягнутий текст
//                             },
//                             chat: {
//                                 id: 'direct-react-chat',
//                             },
//                         }),
//                     });

//                     if (response.ok) {
//                         console.log('Бекенд успішно прийняв повідомлення від фронтенда!');
//                     }
//                 } catch (error) {
//                     console.error("Не вдалося зв'язатися з бекендом:", error);
//                 }
//             };
//         }
//     }, [location.pathname]);

//     return (
//         <div className="app-container">
//             <Header />
//             <main className="main-container">
//                 <Outlet />
//             </main>
//             <Footer />
//         </div>
//     );
// };

// export default MainLayout;
