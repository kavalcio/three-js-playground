import { Close } from '@mui/icons-material';
import { Box, Dialog, Typography } from '@mui/material';

export const InfoModal = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{ sx: { backgroundColor: 'transparent' } }}
    >
      <Box
        sx={{
          p: 3,
          backgroundColor: '#1f1f1f',
          color: '#ebebeb',
          minWidth: 300,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: 20 }}>
            {title}
          </Typography>
          <Close
            sx={{ ml: 3, '&:hover': { opacity: 0.7 }, cursor: 'pointer' }}
            onClick={onClose}
          />
        </Box>
        {children}
      </Box>
    </Dialog>
  );
};
