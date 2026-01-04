import { Box } from '@mui/material';

import {
  CARD_BACK_COORDS,
  CARD_BACKS_TILEMAP,
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

export const CardPlaceholder = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: TILE_WIDTH * TILE_SCALE,
        height: TILE_HEIGHT * TILE_SCALE,
        backgroundImage: `url(${CARD_BACKS_TILEMAP})`,
        imageRendering: 'pixelated',
        backgroundPositionX:
          (-TILESET_HZ_MARGIN - TILE_STEP_HZ * CARD_BACK_COORDS.col) *
          TILE_SCALE,
        backgroundPositionY:
          (-TILESET_VT_MARGIN - TILE_STEP_VT * CARD_BACK_COORDS.row) *
          TILE_SCALE,
        backgroundSize: `${TILESET_WIDTH * TILE_SCALE}px ${TILESET_HEIGHT * TILE_SCALE}px`,
      }}
    />
  );
};
