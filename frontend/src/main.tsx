import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.scss';
import App from './app/App.tsx';
import { SearchProvider } from './providers/SearchProvider.tsx';
import { UserProvider } from './providers/UserProvider.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <UserProvider>
            <SearchProvider>
                <App />
            </SearchProvider>
        </UserProvider>
    </StrictMode>,
);
