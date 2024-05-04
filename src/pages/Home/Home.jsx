import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

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
      {Object.values(ROUTES).map((route) => (
        <Link key={route.path} to={route.path}>
          {route.title}
        </Link>
      ))}
    </div>
  );
};
