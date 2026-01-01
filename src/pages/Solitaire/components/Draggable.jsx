import { useDraggable } from '@dnd-kit/core';
import { Box } from '@mui/material';

import { CARDS } from '@/constants';

// TODO: You'll likely want to alter the z-index of your Draggable component to ensure it appears on top of other elements.
export const Draggable = ({ index, cardId }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: cardId,
  });

  return (
    // <button
    //   ref={setNodeRef}
    //   style={{
    //     color: 'white',
    //     transform: transform
    //       ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    //       : 'none',
    //   }}
    //   {...listeners}
    //   {...attributes}
    // >
    //   {children}
    // </button>
    <Box
      ref={setNodeRef}
      sx={{
        color: 'white',
        width: 100,
        height: 100,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : 'none',
        zIndex: 10 + index,
        position: 'absolute',
        top: index * 10,
        left: index,
      }}
      {...listeners}
      {...attributes}
    >
      {/* <img
        src="/cards_tilemap.png"
        style={{ width: 100, height: 100, imageRendering: 'pixelated' }}
      /> */}
      {CARDS[cardId].name}
    </Box>
  );
};
