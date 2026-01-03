import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Box } from '@mui/material';
import { useMemo, useState } from 'react';

import { CARDS, FOUNDATION_DROPPABLE_ID, STACKS, SUITS } from '@/constants';
import { Card, Stack } from '@/types';
import {
  flattenStacks,
  generateSuitArray,
  initializeSolitaireBoard,
  insertCardFoundation,
  insertCardTableau,
} from '@/utils';

import { CardPlaceholder, Draggable, Droppable } from './components';

// TODO: add animations so that cards dont just snap to positions
// TODO: add win condition when all cards are in foundation
// TODO: add ability to undo move? could just persist the last X versions of state
// TODO: do easy and hard mode where you either draw 1 or 3 cards at a time
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

  const { cards, stacks, stock, waste, foundation } = state;

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
    flat: flattenStacks(stacks, cards),
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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box
        sx={{
          backgroundColor: 'green',
          height: '100vh',
          width: '100vw',
        }}
      >
        <Box sx={{ height: 150, p: 3, display: 'flex', gap: 2 }}>
          {/* TODO: render all cards in the stock with a 1px offset from the last, so that the deck's thickness shows how many cards are left in the pile */}
          <Box
            onClick={onDrawCard}
            sx={{
              position: 'relative',
              border: '1px solid white',
              cursor: 'pointer',
              width: 'fit-content',
            }}
          >
            {/* {stock.map((cardId, index) => (
              <Box key={cardId} sx={{ position: 'absolute', top: 0, left: 0 }}>
                <Draggable cardId={cardId} index={index} cards={cards} />
              </Box>
            ))} */}
            <Box sx={{ visibility: stock.length > 0 ? 'visible' : 'hidden' }}>
              <CardPlaceholder />
            </Box>
          </Box>
          <Box sx={{ position: 'relative', height: 150, width: 100 }}>
            {waste.map((cardId, index) => (
              <Box key={cardId} sx={{ position: 'absolute', top: 0, left: 0 }}>
                <Draggable cardId={cardId} index={index} cards={cards} />
              </Box>
            ))}
          </Box>
          <Droppable id={FOUNDATION_DROPPABLE_ID}>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              {SUITS.map((suit) => (
                <Box
                  key={suit}
                  sx={{ width: 50, height: 50, border: '1px solid red' }}
                >
                  {foundation[suit].length > 0 && (
                    <Draggable
                      cardId={foundation[suit][foundation[suit].length - 1]}
                      index={0}
                      cards={cards}
                      disabled
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Droppable>
          <button
            style={{ color: 'lightgray' }}
            onClick={() => {
              const output = initializeSolitaireBoard();
              setState(output);
            }}
          >
            Reset
          </button>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
          }}
        >
          {sortedStackIds.map((stackId) => (
            <Droppable key={stackId} id={stackId}>
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
      </Box>
    </DndContext>
  );
};
