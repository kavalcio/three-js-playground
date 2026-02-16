import { Box } from '@mui/material';

import { TILEMAP_VALUES } from '@/constants';
import { BoardState } from '@/types';

import { CardPlaceholder } from './CardPlaceholder';

export const Stock = ({
  onDrawCard,
  stock,
}: {
  onDrawCard: () => void;
  stock: BoardState['stock'];
}) => {
  return (
    <Box
      onClick={onDrawCard}
      sx={{
        backgroundColor: '#1a8d1a',
        border: '2px solid white',
        cursor: 'pointer',
        width: TILEMAP_VALUES.tileWidth,
        height: TILEMAP_VALUES.tileHeight,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {stock.map((cardId, index) => (
          <Box
            key={cardId}
            sx={{ position: 'absolute', top: -index, left: -index }}
          >
            <CardPlaceholder />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
