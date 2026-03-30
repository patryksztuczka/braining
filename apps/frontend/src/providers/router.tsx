import { createBrowserRouter, RouterProvider } from 'react-router';
import { Component as ErrorPage } from '../components/pages/error';

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
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
