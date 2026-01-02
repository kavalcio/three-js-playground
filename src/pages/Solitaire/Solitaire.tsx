import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Box } from '@mui/material';
import { useMemo, useState } from 'react';

import { CARDS, STACKS } from '@/constants';
import { Card, Stack } from '@/types';
import {
  checkCardInsertAllowed,
  flattenStacks,
  initializeSolitaireBoard,
} from '@/utils';

import { CardPlaceholder, Draggable, Droppable } from './components';

// TODO: do easy and hard mode where you either draw 1 or 3 cards at a time
export const Solitaire = () => {
  const [state, setState] = useState<{
    cards: Record<string, Card>;
    stacks: Record<string, Stack>;
    stock: string[];
    waste: string[];
  }>({
    cards: structuredClone(CARDS),
    stacks: structuredClone(STACKS),
    stock: [],
    waste: [],
  });

  const { cards, stacks, stock, waste } = state;

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('e', event);
    if (!event.over) return;
    const draggedCardId = event.active.id as string;
    const droppedStackId = event.over.id as string;

    // TODO: early return if the dragged card is already in the stack?

    const stack = stacks[droppedStackId];
    let lastCardInStack: string | null = null;
    if (stack.child) {
      let node: Stack | Card = stack;
      while (node.child) {
        node = cards[node.child];
      }
      lastCardInStack = node.id;
    }

    // Check if target move is allowed
    const allowed = checkCardInsertAllowed(draggedCardId, lastCardInStack);
    if (!allowed) return;

    const newStacks = { ...stacks };
    const newCards = { ...cards };

    if (newCards[draggedCardId].parent) {
      if (newCards[draggedCardId].parent.includes('stk_')) {
        // If parent is a stack, set its child to null
        newStacks[newCards[draggedCardId].parent] = {
          ...newStacks[newCards[draggedCardId].parent],
          child: null,
        };
      } else {
        // If parent is a card, set its child to null and reveal it (if hidden)
        newCards[newCards[draggedCardId].parent] = {
          ...newCards[newCards[draggedCardId].parent],
          child: null,
          hidden: false, // Reveal the parent card
        };
      }
    }
    // Update parent of new card to last node
    newCards[draggedCardId] = {
      ...newCards[draggedCardId],
      parent: lastCardInStack ?? droppedStackId,
    };
    // Update child of last node to new card
    if (lastCardInStack) {
      newCards[lastCardInStack] = {
        ...newCards[lastCardInStack],
        child: draggedCardId,
      };
    } else {
      // If no last card, it means we're adding to an empty stack
      newStacks[droppedStackId] = {
        ...newStacks[droppedStackId],
        child: draggedCardId,
      };
    }

    // Remove the card from the waste deck
    const newWaste = waste.filter((card) => card !== draggedCardId);

    setState({
      stock: state.stock,
      cards: newCards,
      stacks: newStacks,
      waste: newWaste,
    });
  };

  console.log('aaa', {
    cards,
    stacks,
    waste,
    stock,
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
