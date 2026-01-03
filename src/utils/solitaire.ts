import { CARDS, STACKS, SUITS } from '@/constants';
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

  // Add remaining cards to the stock deck
  const stock = cardIds;
  stock.forEach((cardId) => {
    cards[cardId].hidden = true;
  });

  console.log('r', { cards, stacks, stock });
  return { cards, stacks, stock, waste: [], foundation: generateSuitArray() };
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

export const insertCardFoundation = ({
  stacks,
  cards,
  waste,
  foundation,
  draggedCardId,
}: {
  stacks: Record<string, Stack>;
  cards: Record<string, Card>;
  waste: string[];
  foundation: Record<string, string[]>;
  draggedCardId: string;
}) => {
  // Don't allow if card has any children
  const newCard = cards[draggedCardId];
  if (newCard.child) return;

  const suit = draggedCardId.slice(0, 3);
  const previousCardId = foundation[suit][foundation[suit].length - 1];

  const allowed = checkFoundationInsertAllowed(draggedCardId, previousCardId);
  if (!allowed) return;

  const newStacks = { ...stacks };
  const newCards = { ...cards };
  const newFoundation = { ...foundation };

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
  // Update parent of new card to null
  newCards[draggedCardId] = {
    ...newCards[draggedCardId],
    parent: null,
  };

  // Add card to foundation
  newFoundation[suit] = [...newFoundation[suit], draggedCardId];

  // Remove the card from the waste deck
  const newWaste = waste.filter((card) => card !== draggedCardId);

  return {
    cards: newCards,
    stacks: newStacks,
    foundation: newFoundation,
    waste: newWaste,
  };
};

export const checkFoundationInsertAllowed = (
  newCard: string,
  previousCard: string | null,
) => {
  if (!previousCard) {
    return newCard.slice(4, 10) === '1'; // Only allow king if no previous card exists
  }

  const newNumber = newCard.slice(4, 10);
  const previousNumber = previousCard?.slice(4, 10);

  if (newNumber === '1') {
    return !previousNumber;
  } else if (newNumber === 'jack') {
    return previousNumber === '10';
  } else if (newNumber === 'queen') {
    return previousNumber === 'jack';
  } else if (newNumber === 'king') {
    return previousNumber === 'queen';
  } else {
    const newValue = parseInt(newNumber, 10);
    const previousValue = parseInt(previousNumber, 10);
    console.log('numbers', { newValue, previousValue });
    return newValue === previousValue + 1;
  }
};

export const insertCardTableau = ({
  stacks,
  cards,
  waste,
  draggedCardId,
  droppedStackId,
}: {
  stacks: Record<string, Stack>;
  cards: Record<string, Card>;
  waste: string[];
  draggedCardId: string;
  droppedStackId: string;
}) => {
  // TODO: early return if the dragged card is already in the stack?
  // Yes, because right now it just disappears

  const stack = stacks[droppedStackId];
  let lastCardInStack: string | null = null;
  if (stack.child) {
    let node: Stack | Card = stack;
    let cardAlreadyInStack = false;
    while (node.child) {
      node = cards[node.child];
      if (node.id === draggedCardId) {
        cardAlreadyInStack = true;
        break;
      }
    }
    if (cardAlreadyInStack) return;
    lastCardInStack = node.id;
  }

  // Check if target move is allowed
  const allowed = checkTableauInsertAllowed(draggedCardId, lastCardInStack);
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

  return {
    cards: newCards,
    stacks: newStacks,
    waste: newWaste,
  };
};

export const checkTableauInsertAllowed = (
  newCard: string,
  previousCard: string | null,
) => {
  // return true;
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
  } else if (newNumber === '10') {
    return previousNumber === 'jack';
  } else {
    const newValue = parseInt(newNumber, 10);
    const previousValue = parseInt(previousNumber, 10);
    return newValue === previousValue - 1;
  }
};

export const generateSuitArray = () => {
  return SUITS.reduce(
    (acc, suit) => {
      acc[suit] = [];
      return acc;
    },
    {} as Record<string, string[]>,
  );
};
