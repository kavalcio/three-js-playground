import { useDroppable } from '@dnd-kit/core';
import { Box } from '@mui/material';

export const Droppable = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        padding: '20px',
        margin: '20px',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: isOver ? 'green' : 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        width: 200,
      }}
    >
      {children}
    </Box>
  );
};
