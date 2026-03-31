import { createBrowserRouter, RouterProvider } from 'react-router';
import { Component as ErrorPage } from '../components/pages/error';
import { DashboardLayout } from '../components/layouts/dashboard-layout';

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        lazy: () => import('../components/pages/home'),
      },
      {
        path: '/sign-in',
        lazy: () => import('../components/pages/sign-in'),
      },
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            lazy: () => import('../components/pages/dashboard'),
          },
        ],
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
