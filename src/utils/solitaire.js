export const checkCardInsertAllowed = (newCard, previousCard) => {
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
