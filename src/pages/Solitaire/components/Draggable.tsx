import { useDraggable } from '@dnd-kit/core';
import { Box } from '@mui/material';

import {
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
}: {
  index: number;
  cardId: string;
  cards: BoardState['cards'];
  disabled?: boolean;
}) => {
  const card = cards[cardId];

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: cardId,
    disabled: card.hidden || disabled,
  });

  const spriteCol = card.hidden
    ? VALUES.backTileCoords.col
    : card.spriteCoords.col;
  const spriteRow = card.hidden
    ? VALUES.backTileCoords.row
    : card.spriteCoords.row;

  return (
    <Box
      ref={setNodeRef}
      sx={[
        {
          cursor: card.hidden || disabled ? 'default' : 'grab',
          touchAction: 'none',
          zIndex: 10 + index,
          width: VALUES.tileWidth,
          height: VALUES.tileHeight,
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : 'none',
        },
        !!VALUES.backgroundTileCoords && {
          backgroundImage: `url(${VALUES.backUrl})`,
          imageRendering: 'pixelated',
          backgroundPositionX:
            (-VALUES.marginHorizontal -
              VALUES.stepHorizontal * VALUES.backgroundTileCoords.col) *
            TILE_SCALE,
          backgroundPositionY:
            (-VALUES.marginVertical -
              VALUES.stepVertical * VALUES.backgroundTileCoords.row) *
            TILE_SCALE,
          backgroundSize: `${VALUES.totalWidthBack}px ${VALUES.totalHeightBack}px`,
        },
      ]}
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
          backgroundSize: `${card.hidden ? VALUES.totalWidthBack : VALUES.totalWidth}px ${card.hidden ? VALUES.totalHeightBack : VALUES.totalHeight}px`,
        }}
      />
      {!!card.child && (
        <Box sx={{ mt: `-${VALUES.tileHeight - CARD_PADDING}px` }}>
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
