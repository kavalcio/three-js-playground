import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Box } from '@mui/material';
import { useMemo, useState } from 'react';

import { CARDS, STACKS } from '@/constants';
import { Card, Stack } from '@/types';
import { checkCardInsertAllowed } from '@/utils';

import { Draggable, Droppable } from './components';

// TODO: do easy and hard mode where you either draw 1 or 3 cards at a time
export const Solitaire = () => {
  const [cards, setCards] = useState<Record<string, Card>>(CARDS);
  const [stacks, setStacks] = useState<Record<string, Stack>>(STACKS);
  const [deck, setDeck] = useState<string[]>(Object.keys(CARDS));

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('e', event);
    if (!event.over) return;
    const draggedCardId = event.active.id as string;
    const droppedStackId = event.over.id as string;

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
    // If new card has parent, update its child to null
    if (newCards[draggedCardId].parent) {
      if (newCards[draggedCardId].parent.includes('stk_')) {
        // If parent is a stack, set its child to null
        newStacks[newCards[draggedCardId].parent] = {
          ...newStacks[newCards[draggedCardId].parent],
          child: null,
        };
      } else {
        // If parent is a card, set its child to null
        newCards[newCards[draggedCardId].parent] = {
          ...newCards[newCards[draggedCardId].parent],
          child: null,
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

    setStacks(newStacks);
    setCards(newCards);

    // Remove the card from the deck
    setDeck((prevDeck) => prevDeck.filter((card) => card !== draggedCardId));
  };

  console.log({
    cards,
    stacks,
    deck,
  });

  const sortedStackIds = useMemo(() => {
    return Object.keys(stacks).sort((a, b) => a.localeCompare(b));
  }, [stacks]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
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
          <Draggable key={cardId} cardId={cardId} index={index} cards={cards} />
        ))}
      </Box>
    </DndContext>
  );
};
