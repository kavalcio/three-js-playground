import { Box } from '@mui/material';

import {
  CARD_BACK_COORDS,
  TILE_SCALE,
  TILEMAP_VALUES as VALUES,
} from '@/constants';

export const CardPlaceholder = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: VALUES.tileWidth,
        height: VALUES.tileHeight,
        backgroundImage: `url(${VALUES.backUrl})`,
        imageRendering: 'pixelated',
        backgroundPositionX:
          (-VALUES.marginHorizontal -
            VALUES.stepHorizontal * CARD_BACK_COORDS.col) *
          TILE_SCALE,
        backgroundPositionY:
          (-VALUES.marginVertical -
            VALUES.stepVertical * CARD_BACK_COORDS.row) *
          TILE_SCALE,
        backgroundSize: `${VALUES.totalWidth}px ${VALUES.totalHeight}px`,
      }}
    />
  );
};
