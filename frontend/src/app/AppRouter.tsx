import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from '../components/Header';

const HomePage = lazy(() => import('../pages/HomePage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ItemPage = lazy(() => import('../pages/ItemPage'));
const AuthPage = lazy(() => import('../pages/AuthPage'));

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Header />
            <Suspense fallback={<div>Loading Page</div>}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/items/:id" element={<ItemPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default AppRouter;
