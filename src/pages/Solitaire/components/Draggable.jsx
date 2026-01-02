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

export const Draggable = ({ index, cardId, stackId }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: cardId,
      data: { currentStackId: stackId },
    });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        width: TILE_WIDTH * TILE_SCALE,
        height: TILE_HEIGHT * TILE_SCALE,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : 'none',
        zIndex: 10 + index + (isDragging ? 200 : 0),
        position: 'absolute',
        top: index * 15 * TILE_SCALE,
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
