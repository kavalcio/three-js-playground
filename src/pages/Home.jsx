import { Link } from 'react-router-dom';

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
      Root
      <Link to="/mystify">Mystify</Link>
    </div>
  );
};
