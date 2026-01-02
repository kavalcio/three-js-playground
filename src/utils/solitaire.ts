import { CARDS, STACKS } from '@/constants';
import { Card, Stack } from '@/types';

// Fisher Yates shuffle algorithm
const shuffle = (inputArray: any[]) => {
  const array = [...inputArray];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const initializeSolitaireBoard = () => {
  const stacks = structuredClone(STACKS);
  const cards = structuredClone(CARDS);

  const cardIds: string[] = shuffle(Object.keys(CARDS));

  Object.keys(stacks)
    .sort((a, b) => a.localeCompare(b))
    .forEach((stackId, index) => {
      const cardsToAdd = index + 1;
      const stackCards = cardIds.splice(0, cardsToAdd);

      // Add first card in list to stack
      const firstCard = stackCards.shift()!;
      stacks[stackId].child = firstCard;
      cards[firstCard].parent = stackId;

      if (stackCards.length === 0) return;

      // Add remaining cards to the stack as children
      let lastCardId = stacks[stackId].child;
      stackCards.forEach((cardId) => {
        cards[cardId].parent = lastCardId;
        cards[lastCardId].child = cardId;
        cards[lastCardId].hidden = true;
        lastCardId = cardId;
      });
    });

  // Add remaining cards to the deck
  const deck = cardIds;
  console.log('r', { cards, stacks, deck });
  return { cards, stacks, deck };
};

export const flattenStacks = (
  stacks: Record<string, Stack>,
  cards: Record<string, Card>,
) => {
  const flattened: string[][] = [];
  Object.keys(stacks).forEach((stackId) => {
    let currentStack: Stack | Card = stacks[stackId];
    flattened.push([]);
    while (currentStack.child) {
      flattened[flattened.length - 1].push(currentStack.child);
      currentStack = cards[currentStack.child];
    }
  });
  return flattened;
};

export const checkCardInsertAllowed = (
  newCard: string,
  previousCard: string | null,
) => {
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
