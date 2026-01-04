import { useDraggable } from '@dnd-kit/core';
import { Box } from '@mui/material';
import { useEffect } from 'react';

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

export const Draggable = ({
  index,
  cardId,
  cards,
  disabled,
  onDragStateChange,
}: {
  index: number;
  cardId: string;
  cards: BoardState['cards'];
  disabled?: boolean;
  onDragStateChange?: (dragging: boolean) => void;
}) => {
  const card = cards[cardId];

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: cardId,
      disabled: card.hidden || disabled,
    });

  useEffect(() => {
    onDragStateChange?.(isDragging);
  }, [cardId, isDragging, onDragStateChange]);

  const spriteCol = card.hidden ? CARD_BACK_COORDS.col : card.spriteCoords.col;
  const spriteRow = card.hidden ? CARD_BACK_COORDS.row : card.spriteCoords.row;

  return (
    <Box
      ref={setNodeRef}
      sx={{
        cursor: card.hidden || disabled ? 'default' : 'grab',
        touchAction: 'none',
        zIndex: 10 + index,
        width: TILE_WIDTH * TILE_SCALE,
        height: TILE_HEIGHT * TILE_SCALE,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : 'none',
      }}
      {...listeners}
      {...attributes}
    >
      <Box
        sx={{
          width: TILE_WIDTH * TILE_SCALE,
          height: TILE_HEIGHT * TILE_SCALE,
          backgroundImage: `url(${card.hidden ? CARD_BACKS_TILEMAP : CARDS_TILEMAP})`,
          imageRendering: 'pixelated',
          backgroundPositionX:
            (-TILESET_HZ_MARGIN - TILE_STEP_HZ * spriteCol) * TILE_SCALE,
          backgroundPositionY:
            (-TILESET_VT_MARGIN - TILE_STEP_VT * spriteRow) * TILE_SCALE,
          backgroundSize: `${TILESET_WIDTH * TILE_SCALE}px ${TILESET_HEIGHT * TILE_SCALE}px`,
        }}
      />
      {!!card.child && (
        <Box sx={{ mt: `-${(TILE_HEIGHT - CARD_PADDING) * TILE_SCALE}px` }}>
          <Draggable
            key={card.child}
            index={index + 1}
            cardId={card.child}
            cards={cards}
            onDragStateChange={onDragStateChange}
          />
        </Box>
      )}
    </Box>
  );
};
