import { createBrowserRouter, RouterProvider } from 'react-router';
import { GuestOnlyRoute } from '../components/auth/guest-only-route';
import { ProtectedRoute } from '../components/auth/protected-route';
import { ErrorPage } from '../components/pages/error';
import { DashboardLayout } from '../components/layouts/dashboard-layout';

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        element: <GuestOnlyRoute />,
        children: [
          {
            path: '/sign-in',
            lazy: async () => {
              const { SignInPage } = await import('../components/pages/sign-in');
              return { Component: SignInPage };
            },
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: '/',
                lazy: async () => {
                  const { DashboardPage } = await import('../components/pages/dashboard');
                  return { Component: DashboardPage };
                },
              },
              {
                path: '/projects',
                lazy: async () => {
                  const { ProjectsPage } = await import(
                    '../modules/projects/pages/projects-page'
                  );
                  return { Component: ProjectsPage };
                },
              },
              {
                path: '/projects/:projectId',
                lazy: async () => {
                  const { ProjectDetailsPage } = await import(
                    '../modules/projects/pages/project-details-page'
                  );
                  return { Component: ProjectDetailsPage };
                },
              },
              {
                path: '/boards',
                lazy: async () => {
                  const { BoardsPage } = await import('../components/pages/boards');
                  return { Component: BoardsPage };
                },
              },
            ],
          },
        ],
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
