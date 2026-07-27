import { useContext, createContext } from 'react';
import type { UserInfo } from '../types/user.types';

interface userContextType {
    user: UserInfo | null;
    setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
    loader: boolean;
    error: string;
}

export const UserContext = createContext<userContextType | null>(null);

export const useUserInfo = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserInfo must be used inside UserProvider');
    }
    return context;
};
