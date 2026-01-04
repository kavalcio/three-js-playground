import { useDraggable } from '@dnd-kit/core';
import { Box } from '@mui/material';

import {
  CARD_BACK_COORDS,
  CARD_BACKS_TILEMAP,
  CARD_PADDING,
  CARDS_TILEMAP,
  TILE_HEIGHT,
  TILE_SCALE,
  TILE_STEP_HZ,
  TILE_STEP_VT,
  TILE_WIDTH,
  TILESET_HEIGHT,
  TILESET_HZ_MARGIN,
  TILESET_VT_MARGIN,
  TILESET_WIDTH,
} from '@/constants';
import { BoardState } from '@/types';

// TODO: z index of the grabbed item doesnt go over everything else, fix it. i think because its the child of somethign else
export const Draggable = ({
  index,
  cardId,
  cards,
  disabled,
}: {
  index: number;
  cardId: string;
  cards: BoardState['cards'];
  disabled?: boolean;
}) => {
  const card = cards[cardId];

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: cardId,
      disabled: card.hidden || disabled,
    });

  const spriteCol = card.hidden ? CARD_BACK_COORDS.col : card.spriteCoords.col;
  const spriteRow = card.hidden ? CARD_BACK_COORDS.row : card.spriteCoords.row;

  return (
    <Box
      ref={setNodeRef}
      sx={{
        cursor: card.hidden || disabled ? 'default' : 'grab',
        position: 'relative',
        width: TILE_WIDTH * TILE_SCALE,
        height: TILE_HEIGHT * TILE_SCALE,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : 'none',
        zIndex: 10 + index + (isDragging ? 200 : 0),
        backgroundImage: `url(${card.hidden ? CARD_BACKS_TILEMAP : CARDS_TILEMAP})`,
        imageRendering: 'pixelated',
        backgroundPositionX:
          (-TILESET_HZ_MARGIN - TILE_STEP_HZ * spriteCol) * TILE_SCALE,
        backgroundPositionY:
          (-TILESET_VT_MARGIN - TILE_STEP_VT * spriteRow) * TILE_SCALE,
        backgroundSize: `${TILESET_WIDTH * TILE_SCALE}px ${TILESET_HEIGHT * TILE_SCALE}px`,
      }}
      {...listeners}
      {...attributes}
    >
      {!!card.child && (
        <Box
          sx={{
            position: 'absolute',
            top: CARD_PADDING * TILE_SCALE,
          }}
        >
          <Draggable
            key={card.child}
            index={index + 1}
            cardId={card.child}
            cards={cards}
          />
        </Box>
      )}
    </Box>
  );
};
