import { Box } from '@mui/material';

export const Button = ({ children, sx, ...props }) => (
  <Box
    component="button"
    sx={{
      p: 0,
      border: 'none',
      backgroundColor: 'maroon',
      borderRadius: 4,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      transition: 'background-color 0.1s',
      color: 'white',
      '&:hover': { backgroundColor: 'darkred' },
      '&:active': { backgroundColor: 'firebrick' },
      '&:focus': { outline: 'none' },
      ...sx,
    }}
    {...props}
  >
    {children}
  </Box>
);
