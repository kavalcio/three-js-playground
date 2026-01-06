import { Box } from '@mui/material';

import { TILEMAP_VALUES } from '@/constants';
import { BoardState } from '@/types';

import { Draggable } from './Draggable';

export const Waste = ({
  waste,
  cards,
}: {
  waste: BoardState['waste'];
  cards: BoardState['cards'];
}) => {
  return (
    <Box
      sx={{
        backgroundColor: '#1a8d1a',
        border: '2px solid white',
        width: TILEMAP_VALUES.tileWidth,
        height: TILEMAP_VALUES.tileHeight,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {waste.map((cardId, index) => (
          <Box
            key={cardId}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 6,
            }}
          >
            <Draggable cardId={cardId} index={index} cards={cards} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
