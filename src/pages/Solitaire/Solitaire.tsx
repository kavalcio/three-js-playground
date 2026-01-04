import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Box } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import {
  CARDS,
  FOUNDATION_DROPPABLE_ID,
  STACKS,
  TILE_HEIGHT,
  TILE_SCALE,
  TILE_WIDTH,
} from '@/constants';
import { Card, Stack } from '@/types';
import {
  flattenStacks,
  generateSuitArray,
  initializeSolitaireBoard,
  insertCardFoundation,
  insertCardTableau,
} from '@/utils';

import {
  CardPlaceholder,
  Draggable,
  Droppable,
  Foundation,
  VictoryScreen,
} from './components';

// TODO: add animations so that cards dont just snap to positions
// TODO: add win condition when all cards are in foundation
// TODO: add ability to undo move? could just persist the last X versions of state
// TODO: do easy and hard mode where you either draw 1 or 3 cards at a time
// TODO: show move count on screen (and on victory screen. maybe add a leaderboard?)
export const Solitaire = () => {
  const [state, setState] = useState<{
    cards: Record<string, Card>;
    stacks: Record<string, Stack>;
    stock: string[];
    waste: string[];
    foundation: Record<string, string[]>;
  }>({
    cards: structuredClone(CARDS),
    stacks: structuredClone(STACKS),
    stock: [],
    waste: [],
    foundation: generateSuitArray(),
  });

  const [isVictory, setIsVictory] = useState(false);

  const { cards, stacks, stock, waste, foundation } = state;

  useEffect(() => {
    // Show win screen if win all cards are collected
    const foundationCardCount = Object.values(state.foundation).reduce(
      (acc, f) => acc + f.length,
      0,
    );
    console.log('foundationCardCount', foundationCardCount);
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
    setState({
      ...state,
      ...newState,
    });
  };

  console.log('aaa', {
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
    const output = initializeSolitaireBoard();
    setState(output);
    setIsVictory(false);
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
        {isVictory && <VictoryScreen onNewGame={onNewGame} />}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            pt: 5,
            gap: 2,
            mx: 'auto',
            width: 'fit-content',
            // maxWidth: 'fit-content',
            // width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, mb: 5 }}>
            <Box
              onClick={onDrawCard}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
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
                backgroundColor: 'rgba(255,255,255,0.1)',
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
            <Box sx={{ ml: 'auto' }}>
              <Foundation foundation={state.foundation} cards={state.cards} />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
            }}
          >
            {sortedStackIds.map((stackId, index) => (
              <Droppable
                key={stackId}
                id={stackId}
                cardCount={flattenedStacks[index].length}
              >
                {!!stacks[stackId].child && (
                  <Draggable
                    key={stacks[stackId].child}
                    index={0}
                    cardId={stacks[stackId].child}
                    cards={cards}
                  />
                )}
              </Droppable>
            ))}
          </Box>
          <button onClick={onNewGame}>Reset</button>
        </Box>
      </Box>
    </DndContext>
  );
};
