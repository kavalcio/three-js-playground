import { useDroppable } from '@dnd-kit/core';
import { Box } from '@mui/material';

import { CARD_PADDING, TILE_HEIGHT, TILE_SCALE, TILE_WIDTH } from '@/constants';

export const Droppable = ({
  id,
  children,
  cardCount = 1,
}: {
  id: string;
  children?: React.ReactNode;
  cardCount?: number;
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        position: 'relative',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: isOver ? 'white' : 'green',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 1,
        width: TILE_WIDTH * TILE_SCALE,
        height:
          TILE_HEIGHT * TILE_SCALE +
          Math.max(0, cardCount - 1) * CARD_PADDING * TILE_SCALE,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: 'rgba(255,255,255,0.1)',
          width: TILE_WIDTH * TILE_SCALE,
          height: TILE_HEIGHT * TILE_SCALE,
        }}
      />
      {children}
    </Box>
  );
};
