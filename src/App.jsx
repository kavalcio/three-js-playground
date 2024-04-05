import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import { Home, Template } from '@/pages';
import { ROUTES } from 'src/utils/routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    errorElement: <div>Error</div>,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      ...ROUTES.map((route) => ({
        path: route.path,
        element: <Template demo={route.component} />,
      })),
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
