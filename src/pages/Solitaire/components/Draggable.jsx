import { useDraggable } from '@dnd-kit/core';
import { Box } from '@mui/material';

import cardsTilemap from '/cards_tilemap.png';
import { CARDS } from '@/constants';

const TILESET_WIDTH = 909;
const TILESET_HEIGHT = 259;
const TILESET_HZ_MARGIN = 11;
const TILESET_VT_MARGIN = 2;
const TILE_STEP = 65;
const TILE_WIDTH = 42;
const TILE_HEIGHT = 60;
const TILE_SCALE = 1.5;

// TODO: You'll likely want to alter the z-index of your Draggable component to ensure it appears on top of other elements.
export const Draggable = ({ index, cardId }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: cardId,
    });

  if (isDragging) console.log(cardId);

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
        width: TILE_WIDTH * TILE_SCALE,
        height: TILE_HEIGHT * TILE_SCALE,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : 'none',
        zIndex: 10 + index + (isDragging ? 200 : 0),
        position: 'absolute',
        top: index * 15,
        // left: index,
        mb: 1,
        backgroundImage: `url(${cardsTilemap})`,
        imageRendering: 'pixelated',
        backgroundPositionX:
          (-TILESET_HZ_MARGIN - TILE_STEP * CARDS[cardId].spriteCoords.col) *
          TILE_SCALE,
        backgroundPositionY:
          (-TILESET_VT_MARGIN - TILE_STEP * CARDS[cardId].spriteCoords.row) *
          TILE_SCALE,
        backgroundSize: `${TILESET_WIDTH * TILE_SCALE}px ${TILESET_HEIGHT * TILE_SCALE}px`,
      }}
      {...listeners}
      {...attributes}
    >
      {/* {CARDS[cardId].name} */}
    </Box>
  );
};
