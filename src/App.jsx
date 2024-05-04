import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import {
  Dice,
  Dither,
  FractalBranches,
  Galaxy,
  Home,
  Inkblot,
  Postprocessing,
  RagingSea,
  Refraction,
  SolarSystem,
  VertexSnapping,
} from '@/pages';
import { ROUTES } from '@/constants';

// TODO: add proper 404 page
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
        path: ROUTES.ragingSea.path,
        element: <RagingSea />,
      },
      {
        path: ROUTES.dither.path,
        element: <Dither />,
      },
      {
        path: ROUTES.dice.path,
        element: <Dice />,
      },
      {
        path: ROUTES.galaxy.path,
        element: <Galaxy />,
      },
      {
        path: ROUTES.vertexSnapping.path,
        element: <VertexSnapping />,
      },
      {
        path: ROUTES.inkblot.path,
        element: <Inkblot />,
      },
      {
        path: ROUTES.refraction.path,
        element: <Refraction />,
      },
      {
        path: ROUTES.postprocessing.path,
        element: <Postprocessing />,
      },
      {
        path: ROUTES.fractalBranches.path,
        element: <FractalBranches />,
      },
      {
        path: ROUTES.solarSystem.path,
        element: <SolarSystem />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
