import { useDroppable } from '@dnd-kit/core';
import { Box } from '@mui/material';

import { TILE_HEIGHT, TILE_SCALE, TILE_WIDTH } from '@/constants';

export const Droppable = ({
  id,
  children,
}: {
  id: string;
  children?: React.ReactNode;
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        position: 'relative',
        padding: 1,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: isOver ? 'blue' : 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 1,
        minWidth: TILE_WIDTH * TILE_SCALE,
        minHeight: TILE_HEIGHT * TILE_SCALE,
        // height: 'fit-content',
      }}
    >
      {children}
    </Box>
  );
};
