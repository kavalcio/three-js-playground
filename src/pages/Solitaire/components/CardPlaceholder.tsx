import { Box } from '@mui/material';

import { TILE_SCALE, TILEMAP_VALUES as VALUES } from '@/constants';

export const CardPlaceholder = () => {
  return (
    <Box
      sx={{
        width: VALUES.tileWidth,
        height: VALUES.tileHeight,
        backgroundImage: `url(${VALUES.backUrl})`,
        imageRendering: 'pixelated',
        backgroundPositionX:
          (-VALUES.marginHorizontal -
            VALUES.stepHorizontal * VALUES.backTileCoords.col) *
          TILE_SCALE,
        backgroundPositionY:
          (-VALUES.marginVertical -
            VALUES.stepVertical * VALUES.backTileCoords.row) *
          TILE_SCALE,
        backgroundSize: `${VALUES.totalWidthBack}px ${VALUES.totalHeightBack}px`,
      }}
    />
  );
};
