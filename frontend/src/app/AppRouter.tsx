import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';

const HomePage = lazy(() => import('../pages/HomePage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ItemPage = lazy(() => import('../pages/ItemPage'));
const AuthPage = lazy(() => import('../pages/AuthPage'));

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading Page</div>}>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/items/:id" element={<ItemPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default AppRouter;
