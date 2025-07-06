import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { ORDERED_GROUPS, ROUTE_GROUPS, ROUTES } from '@/constants';

export const Home = () => {
  const groupedRoutes = Object.values(ROUTES).reduce((acc, route) => {
    if (!acc[route.group]) {
      acc[route.group] = [];
    }
    acc[route.group].push(route);
    return acc;
  }, {});

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: {
          xs: 'column',
          sm: 'row',
        },
        p: 2,
      }}
    >
      {ORDERED_GROUPS.map((group) => (
        <Box
          key={group}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            p: 2,
          }}
        >
          <Typography
            sx={{ fontSize: 25, fontWeight: 700, mb: 2, textAlign: 'left' }}
          >
            {ROUTE_GROUPS[group].title}
          </Typography>
          {groupedRoutes[group].map((route) => (
            <Link key={route.path} to={route.path}>
              <Typography sx={{ textAlign: 'left', mb: 0.5 }}>
                {route.title}
              </Typography>
            </Link>
          ))}
        </Box>
      ))}
    </Box>
  );
};
