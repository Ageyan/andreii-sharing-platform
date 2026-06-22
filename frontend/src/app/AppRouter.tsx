import {BrowserRouter, Route, Routes, Link} from 'react-router-dom';
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('../pages/HomePage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ItemPage = lazy(() => import('../pages/ItemPage'));
const AuthPage = lazy(() => import('../pages/AuthPage'));

const AppRouter = () => {
  
  return (
    <BrowserRouter>
        <nav>
            <Link to='/'>Home</Link>
            <Link to='/dashboard'>DashboardPage</Link>
            <Link to='/items/1'>ItemPage (ID:1)</Link>
            <Link to='/auth'>AuthPage</Link>
        </nav>
        <Suspense fallback={<div>Loading Page</div>}>
            <Routes>
                <Route path='/' element={<HomePage/>}/>
                <Route path='/dashboard' element={<DashboardPage/>}/>
                <Route path='/items/:id' element={<ItemPage/>}/>
                <Route path='/auth' element={<AuthPage/>}/>
            </Routes>
        </Suspense>
    </BrowserRouter>
  )
}

export default AppRouter;