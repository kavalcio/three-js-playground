export type Card = {
  id: string;
  name: string;
  spriteCoords: {
    row: number;
    col: number;
  };
};

export type Stack = {
  id: string;
  cards: string[];
};
