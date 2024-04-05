import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import { Home, Template } from '@/pages';
import { mystify } from 'src/demos';

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
      {
        path: '/mystify',
        element: <Template initializer={mystify} />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
