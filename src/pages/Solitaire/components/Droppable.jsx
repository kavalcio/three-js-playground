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
        position: 'relative',
        padding: 1,
        margin: 1,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: isOver ? 'green' : 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        width: 60,
        height: 100,
      }}
    >
      {children}
    </Box>
  );
};
