import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Box } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import {
  FOUNDATION_DROPPABLE_ID,
  TILE_HEIGHT,
  TILE_SCALE,
  TILE_WIDTH,
} from '@/constants';
import { BoardState } from '@/types';
import {
  flattenStacks,
  initializeSolitaireBoard,
  insertCardFoundation,
  insertCardTableau,
} from '@/utils';

import {
  CardPlaceholder,
  Draggable,
  Droppable,
  Foundation,
  MenuBar,
  VictoryScreen,
} from './components';

// TODO: page scrolling is weird, fix it
// TODO: do an early detection of win condition when all cards are revealed and removed from the stock
// TODO: use balatro skin
// TODO: add a context provider for state instead of passing it around as props
// TODO: add ability to undo move? could just persist the last X versions of state, or maybe persist a diff for each move
// TODO: do easy and hard mode where you either draw 1 or 3 cards at a time
// TODO: show move count on victory screen
// TODO: maybe use dialog in VictoryScreen?
export const Solitaire = () => {
  const [state, setState] = useState<BoardState>(initializeSolitaireBoard);
  const [moveCount, setMoveCount] = useState(0);
  const [isVictory, setIsVictory] = useState(false);

  const { cards, stacks, stock, waste, foundation } = state;

  useEffect(() => {
    // Show win screen if win all cards are collected
    const foundationCardCount = Object.values(state.foundation).reduce(
      (acc, f) => acc + f.length,
      0,
    );
    if (foundationCardCount >= 52) {
      setIsVictory(true);
    }
  }, [state, setIsVictory]);

  const flattenedStacks = useMemo(() => {
    return flattenStacks(state.stacks, state.cards);
  }, [state]);

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('e', event);
    if (!event.over) return;
    const draggedCardId = event.active.id as string;
    const droppedStackId = event.over.id as string;

    let newState;
    if (droppedStackId === FOUNDATION_DROPPABLE_ID) {
      newState = insertCardFoundation({
        stacks,
        cards,
        waste,
        foundation,
        draggedCardId,
      });
    } else {
      newState = insertCardTableau({
        stacks,
        cards,
        waste,
        draggedCardId,
        droppedStackId,
      });
    }
    if (!newState) return;
    setState({
      ...state,
      ...newState,
    });
    setMoveCount((prev) => prev + 1);
  };

  console.log('state', {
    cards,
    stacks,
    waste,
    stock,
    foundation,
    flattenedStacks,
  });

  const sortedStackIds = useMemo(() => {
    return Object.keys(stacks).sort((a, b) => a.localeCompare(b));
  }, [stacks]);

  const onDrawCard = () => {
    if (stock.length === 0) {
      // Reset waste into stock when finished
      const newWaste: string[] = [];
      const newStock: string[] = [...waste].reverse(); // Reverse to maintain order
      const newCards = { ...cards };
      newStock.forEach((cardId) => {
        newCards[cardId] = {
          ...newCards[cardId],
          hidden: true, // Hide the card when added back to stock
        };
      });
      setState({
        ...state,
        stock: newStock,
        waste: newWaste,
        cards: newCards,
      });
      return;
    }
    // Draw a card from the stock
    const newWaste = [...waste, stock[stock.length - 1]];
    const newStock = stock.slice(0, stock.length - 1);
    const newCards = { ...cards };
    newCards[stock[stock.length - 1]] = {
      ...cards[stock[stock.length - 1]],
      hidden: false, // Reveal the card when drawn
    };
    setState({
      ...state,
      stock: newStock,
      waste: newWaste,
      cards: newCards,
    });
  };

  const onNewGame = () => {
    if (moveCount > 0 && !isVictory) {
      // TODO: show confirmation if user is mid-game
    }
    const output = initializeSolitaireBoard();
    setState(output);
    setIsVictory(false);
    setMoveCount(0);
  };

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
      <Box
        sx={{
          backgroundColor: 'green',
          height: '100vh',
          width: '100vw',
          overflowX: 'hidden',
        }}
      >
        <MenuBar
          setIsVictory={setIsVictory}
          moveCount={moveCount}
          onNewGame={onNewGame}
        />
        {isVictory && <VictoryScreen onNewGame={onNewGame} />}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 4,
            pt: 5,
            gap: 2,
            mx: 'auto',
            width: 'fit-content',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 5,
              flexWrap: 'wrap',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
              }}
            >
              <Box
                onClick={onDrawCard}
                sx={{
                  backgroundColor: '#1a8d1a',
                  border: '2px solid white',
                  cursor: 'pointer',
                  width: TILE_WIDTH * TILE_SCALE,
                  height: TILE_HEIGHT * TILE_SCALE,
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
              <Box
                sx={{
                  backgroundColor: '#1a8d1a',
                  border: '2px solid white',
                  width: TILE_WIDTH * TILE_SCALE,
                  height: TILE_HEIGHT * TILE_SCALE,
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  {waste.map((cardId, index) => (
                    <Box
                      key={cardId}
                      sx={{ position: 'absolute', top: 0, left: 0 }}
                    >
                      <Draggable cardId={cardId} index={index} cards={cards} />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                ml: { xs: 0, sm: 'auto' },
                mr: { xs: 'auto', sm: 0 },
              }}
            >
              <Foundation foundation={state.foundation} cards={state.cards} />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            {sortedStackIds.map((stackId, index) => (
              <Droppable
                key={stackId}
                id={stackId}
                cardCount={flattenedStacks[index].length}
                stacks={stacks}
                cards={cards}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </DndContext>
  );
};
