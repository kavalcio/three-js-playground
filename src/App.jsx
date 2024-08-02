import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import {
  Dice,
  Dither,
  FractalBranches,
  Galaxy,
  Home,
  Inkblot,
  Demake,
  Postprocessing,
  RagingSea,
  Refraction,
  SolarSystem,
  VertexSnapping,
  CoffeeSmoke,
  Hologram,
} from '@/pages';
import { ROUTES } from '@/constants';

// TODO: add proper 404 page
// TODO: add ability to preset demo params through query params
// TODO: canvas gets re-added to DOM when saving file instead of replacing old instance
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
      {
        path: ROUTES.demake.path,
        element: <Demake />,
      },
      {
        path: ROUTES.coffeeSmoke.path,
        element: <CoffeeSmoke />,
      },
      // {
      //   path: ROUTES.hologram.path,
      //   element: <Hologram />,
      // },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
