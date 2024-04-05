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
      <Link to="/about">About</Link>
      <Link to="/experience">Experience</Link>
    </div>
  );
};
