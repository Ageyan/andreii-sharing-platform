import { useEffect, useState, type ReactNode } from 'react';
import { UserContext } from '../context/UserContext';
import type { UserInfo } from '../types/user.types';
import { getUserInfo } from '../services/user';
import axios from 'axios';

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loader, setLoader] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const getUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoader(false);
                return;
            }

            setLoader(true);
            setError('');

            try {
                const userData = await getUserInfo();
                setUser(userData);
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

    return (
        <UserContext.Provider value={{ user, setUser, loader, error }}>
            {children}
        </UserContext.Provider>
    );
};
