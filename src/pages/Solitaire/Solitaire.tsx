import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Box } from '@mui/material';
import { useState } from 'react';

import { CARDS, STACKS } from '@/constants';
import { Card, Stack } from '@/types';
import { checkCardInsertAllowed } from '@/utils';

import { Draggable, Droppable } from './components';

// TODO: do easy and hard mode where you either draw 1 or 3 cards at a time
export const Solitaire = () => {
  const [deck, setDeck] = useState<Card[]>(Object.values(CARDS));
  const [stacks, setStacks] = useState<Stack[]>(Object.values(STACKS));

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    if (!over) return;

    const draggedCardId = event.active.id as string;
    const droppedStackId = over.id;
    const startingStackId = event.active.data?.current?.currentStackId;

    // If the dragged card is already in the target stack, do nothing
    if (startingStackId === droppedStackId) return;

    // Check if target move is allowed
    const cardsInNewStack =
      stacks.find((s) => s.id === droppedStackId)?.cards ?? [];
    const previousCardInStack = cardsInNewStack[cardsInNewStack.length - 1];
    const allowed = checkCardInsertAllowed(draggedCardId, previousCardInStack);
    if (!allowed) return;

    // Remove card from previous stack (if any) and add it to the new stack
    const newStacks = stacks
      .map((stack) => ({
        ...stack,
        cards: stack.cards.filter((cardId) => cardId !== draggedCardId),
      }))
      .map((stack) =>
        stack.id === droppedStackId
          ? { ...stack, cards: [...stack.cards, draggedCardId] }
          : stack,
      );

    console.log('over', { event, over, draggedCardId, newStacks });
    setStacks(newStacks);

    // Remove the card from the deck
    setDeck((prevDeck) => prevDeck.filter((card) => card.id !== draggedCardId));
  };

  console.log({
    stacks,
    deck,
  });

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
        }}
      >
        {stacks.map((stack) => (
          <Droppable
            key={stack.id}
            id={stack.id}
            // setDeck={setDeck}
            // setStacks={setStacks}
          >
            {stack.cards.map((cardId, index) => (
              <Draggable
                key={cardId}
                cardId={cardId}
                index={index}
                stackId={stack.id}
              />
            ))}
          </Droppable>
        ))}
      </Box>
      <Box
        sx={{
          position: 'relative',
        }}
      >
        {deck.map((card, index) => (
          <Draggable key={card.id} cardId={card.id} index={index} />
        ))}
      </Box>
    </DndContext>
  );
};
