import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../routes/ProtectedRoute';

const HomePage = lazy(() => import('../pages/HomePage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ItemPage = lazy(() => import('../pages/ItemPage'));
const AuthPage = lazy(() => import('../pages/AuthPage'));
const DashProfile = lazy(() => import('../components/DashProfile'));
const DashItems = lazy(() => import('../components/DashItems'));
const DashBookings = lazy(() => import('../components/DashBookings'));

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading Page</div>}>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        >
                            <Route index path="profile" element={<DashProfile />} />
                            <Route path="profile" element={<DashProfile />} />
                            <Route path="items" element={<DashItems />} />
                            <Route path="bookings" element={<DashBookings />} />
                        </Route>
                        <Route path="/items/:id" element={<ItemPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default AppRouter;
