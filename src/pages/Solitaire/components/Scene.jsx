import { DndContext } from '@dnd-kit/core';
import { Box } from '@mui/material';
import { useState } from 'react';

import { CARDS, STACKS } from '@/constants';

import { Draggable } from './Draggable';
import { Droppable } from './Droppable';

export const Scene = () => {
  const [deck, setDeck] = useState(Object.values(CARDS));
  const [stacks, setStacks] = useState(Object.values(STACKS));

  const handleDragEnd = (event) => {
    const { over } = event;
    if (!over) return;

    const droppedStackId = over.id;
    const draggedCardId = event.active.id;

    // TODO: If the dragged card is already in the target stack, do nothing
    // if (draggedCard.stack === overId) return;

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
              <Draggable key={cardId} cardId={cardId} index={index} />
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
