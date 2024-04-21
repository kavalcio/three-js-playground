import { Link } from 'react-router-dom';
import { ROUTES } from 'src/utils/routes';

export const Home = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto',
        padding: 15,
      }}
    >
      Demos
      {ROUTES.map((route) => (
        <Link key={route.path} to={route.path}>
          {route.title}
        </Link>
      ))}
      <Link key={'/weather'} to={'/weather'}>
        Weather App
      </Link>
    </div>
  );
};
