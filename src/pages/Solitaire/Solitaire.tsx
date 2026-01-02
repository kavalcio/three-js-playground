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

import { Draggable, Droppable } from './components';

// TODO: do easy and hard mode where you either draw 1 or 3 cards at a time
export const Solitaire = () => {
  const [state, setState] = useState<{
    cards: Record<string, Card>;
    stacks: Record<string, Stack>;
    deck: string[];
  }>({
    cards: structuredClone(CARDS),
    stacks: structuredClone(STACKS),
    deck: Object.keys(CARDS),
  });

  const { cards, stacks, deck } = state;

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

    // Remove the card from the deck
    const newDeck = deck.filter((card) => card !== draggedCardId);

    setState({
      cards: newCards,
      stacks: newStacks,
      deck: newDeck,
    });
  };

  console.log('aaa', {
    cards,
    stacks,
    deck,
    flat: flattenStacks(stacks, cards),
  });

  const sortedStackIds = useMemo(() => {
    return Object.keys(stacks).sort((a, b) => a.localeCompare(b));
  }, [stacks]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box
        sx={{
          backgroundColor: 'green',
          height: '100vh',
          width: '100vw',
        }}
      >
        <button
          style={{ color: 'lightgray' }}
          onClick={() => {
            const output = initializeSolitaireBoard();
            setState(output);
          }}
        >
          Reset
        </button>
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
        <Box
          sx={{
            position: 'relative',
          }}
        >
          {deck.map((cardId, index) => (
            <Draggable
              key={cardId}
              cardId={cardId}
              index={index}
              cards={cards}
            />
          ))}
        </Box>
      </Box>
    </DndContext>
  );
};
