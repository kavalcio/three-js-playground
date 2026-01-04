import { useDraggable } from '@dnd-kit/core';
import { Box } from '@mui/material';
import { useEffect } from 'react';

import {
  CARD_BACK_COORDS,
  CARD_PADDING,
  TILE_SCALE,
  TILEMAP_VALUES as VALUES,
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
        width: VALUES.tileWidth,
        height: VALUES.tileHeight,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : 'none',
      }}
      {...listeners}
      {...attributes}
    >
      <Box
        sx={{
          width: VALUES.tileWidth,
          height: VALUES.tileHeight,
          backgroundImage: `url(${card.hidden ? VALUES.backUrl : VALUES.frontUrl})`,
          imageRendering: 'pixelated',
          backgroundPositionX:
            (-VALUES.marginHorizontal - VALUES.stepHorizontal * spriteCol) *
            TILE_SCALE,
          backgroundPositionY:
            (-VALUES.marginVertical - VALUES.stepVertical * spriteRow) *
            TILE_SCALE,
          backgroundSize: `${VALUES.totalWidth}px ${VALUES.totalHeight}px`,
        }}
      />
      {!!card.child && (
        <Box sx={{ mt: `-${VALUES.tileHeight - CARD_PADDING}px` }}>
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
