import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import { Home } from '@/pages';

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
        path: '/about',
        element: <div>About</div>,
      },
      {
        path: '/experience',
        element: <div>Experience</div>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
