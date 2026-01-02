import { DndContext } from '@dnd-kit/core';
import { Box } from '@mui/material';
import { useState } from 'react';

import { CARDS, STACKS } from '@/constants';

import { Draggable } from './Draggable';
import { Droppable } from './Droppable';

const checkCardInsertAllowed = (newCard, previousCard) => {
  if (!previousCard) {
    return newCard.slice(4, 10) === 'king'; // Only allow king if no previous card exists
  }

  const newSuite = newCard.slice(0, 3);
  const previousSuite = previousCard.slice(0, 3);

  if (
    (newSuite === 'clb' || newSuite === 'spd') &&
    (previousSuite === 'clb' || previousSuite === 'spd')
  ) {
    return false;
  } else if (
    (newSuite === 'hrt' || newSuite === 'dmd') &&
    (previousSuite === 'hrt' || previousSuite === 'dmd')
  ) {
    return false;
  }

  const newNumber = newCard.slice(4, 10);
  const previousNumber = previousCard.slice(4, 10);

  if (newNumber === 'king') {
    return !previousCard;
  } else if (newNumber === 'queen') {
    return previousNumber === 'king';
  } else if (newNumber === 'jack') {
    return previousNumber === 'queen';
  } else if (newNumber === 'ace') {
    return previousNumber === '2';
  } else if (newNumber === '10') {
    return previousNumber === 'jack';
  } else {
    const newValue = parseInt(newNumber, 10);
    const previousValue = parseInt(previousNumber, 10);
    return newValue === previousValue - 1;
  }
};

export const Scene = () => {
  const [deck, setDeck] = useState(Object.values(CARDS));
  const [stacks, setStacks] = useState(Object.values(STACKS));

  const handleDragEnd = (event) => {
    const { over } = event;
    if (!over) return;

    const draggedCardId = event.active.id;
    const droppedStackId = over.id;
    const startingStackId = event.active.data?.current?.currentStackId;

    // If the dragged card is already in the target stack, do nothing
    if (startingStackId === droppedStackId) return;

    // Check if target move is allowed
    const cardsInNewStack = stacks.find((s) => s.id === droppedStackId).cards;
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
            setDeck={setDeck}
            setStacks={setStacks}
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
        {deck.map(
          (card, index) =>
            !deck.stack && (
              <Draggable key={card.id} cardId={card.id} index={index} />
            ),
        )}
      </Box>
    </DndContext>
  );
};
