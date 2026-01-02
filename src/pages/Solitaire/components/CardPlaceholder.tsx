import { Box } from '@mui/material';

import cardsTilemap from '/cards_tilemap.png';
import {
  CARD_BACK_COORDS,
  TILE_HEIGHT,
  TILE_SCALE,
  TILE_STEP,
  TILE_WIDTH,
  TILESET_HEIGHT,
  TILESET_HZ_MARGIN,
  TILESET_VT_MARGIN,
  TILESET_WIDTH,
} from '@/constants';

export const CardPlaceholder = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: TILE_WIDTH * TILE_SCALE,
        height: TILE_HEIGHT * TILE_SCALE,
        backgroundImage: `url(${cardsTilemap})`,
        imageRendering: 'pixelated',
        backgroundPositionX:
          (-TILESET_HZ_MARGIN - TILE_STEP * CARD_BACK_COORDS.col) * TILE_SCALE,
        backgroundPositionY:
          (-TILESET_VT_MARGIN - TILE_STEP * CARD_BACK_COORDS.row) * TILE_SCALE,
        backgroundSize: `${TILESET_WIDTH * TILE_SCALE}px ${TILESET_HEIGHT * TILE_SCALE}px`,
      }}
    />
  );
};
