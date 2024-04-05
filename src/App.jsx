import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    errorElement: <div>Error</div>,
    children: [
      {
        path: '/',
        element: <div>Root</div>,
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
