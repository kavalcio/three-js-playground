import { useDraggable } from '@dnd-kit/core';
import { Box } from '@mui/material';

import cardsTilemap from '/cards_tilemap.png';
import { Card } from '@/types';

const TILESET_WIDTH = 909;
const TILESET_HEIGHT = 259;
const TILESET_HZ_MARGIN = 11;
const TILESET_VT_MARGIN = 2;
const TILE_STEP = 65;
const TILE_WIDTH = 42;
const TILE_HEIGHT = 60;
const TILE_SCALE = 1.5;

const CARD_BACK_COORDS = { row: 1, col: 13 };

export const Draggable = ({
  index,
  cardId,
  cards,
}: {
  index: number;
  cardId: string;
  cards: Record<string, Card>;
}) => {
  const card = cards[cardId];

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: cardId,
      disabled: card.hidden,
    });

  const spriteCol = card.hidden ? CARD_BACK_COORDS.col : card.spriteCoords.col;
  const spriteRow = card.hidden ? CARD_BACK_COORDS.row : card.spriteCoords.row;

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
        top: index === 0 ? 0 : 15 * TILE_SCALE,
        // top: index * 15 * TILE_SCALE,
        backgroundImage: `url(${cardsTilemap})`,
        imageRendering: 'pixelated',
        backgroundPositionX:
          (-TILESET_HZ_MARGIN - TILE_STEP * spriteCol) * TILE_SCALE,
        backgroundPositionY:
          (-TILESET_VT_MARGIN - TILE_STEP * spriteRow) * TILE_SCALE,
        backgroundSize: `${TILESET_WIDTH * TILE_SCALE}px ${TILESET_HEIGHT * TILE_SCALE}px`,
      }}
      {...listeners}
      {...attributes}
    >
      {!!card.child && (
        <Draggable
          key={card.child}
          index={index + 1}
          cardId={card.child}
          cards={cards}
        />
      )}
    </Box>
  );
};
