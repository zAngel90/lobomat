import { RouteObject } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { StorePage } from './pages/Store';
import { BotPage } from './pages/Bot';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import { CheckoutPage } from './pages/Checkout';
import { Success } from './pages/Success';
import { PaymentPage } from './pages/PaymentPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/store',
    element: <StorePage />
  },
  {
    path: '/payment',
    element: <PaymentPage />
  },
  {
    path: '/checkout',
    element: <CheckoutPage />
  },
  {
    path: '/bot',
    element: <BotPage />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />
  },
  {
    path: '/success',
    element: <Success />
  }
];
