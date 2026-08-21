import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { BookingsProvider } from '../providers/BookingsProvider';

import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../routes/ProtectedRoute';
import Loader from '../components/common/Loader';
import BookingsMy from '../components/dashboard/BookingsMy';
import BookingsOwner from '../components/dashboard/BookingsOwner';

const HomePage = lazy(() => import('../pages/HomePage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ItemPage = lazy(() => import('../pages/ItemPage'));
const AuthPage = lazy(() => import('../pages/AuthPage'));
const DashProfile = lazy(() => import('../components/dashboard/DashProfile'));
const DashItems = lazy(() => import('../components/dashboard/DashItems'));
const DashBookings = lazy(() => import('../components/dashboard/DashBookings'));
const DashChats = lazy(() => import('../components/dashboard/DashChats'));

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loader fullPage />}>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <BookingsProvider>
                                        <DashboardPage />
                                    </BookingsProvider>
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<DashProfile />} />
                            <Route path="profile" element={<DashProfile />} />
                            <Route path="items" element={<DashItems />} />
                            <Route path="bookings" element={<DashBookings />}>
                                <Route index element={<BookingsMy />} />
                                <Route path="my" element={<BookingsMy />} />
                                <Route path="owner" element={<BookingsOwner />} />
                            </Route>
                            <Route path="chats" element={<DashChats />} />
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
