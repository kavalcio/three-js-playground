export type Card = {
  id: string;
  name: string;
  spriteCoords: {
    row: number;
    col: number;
  };
  child: string | null;
  parent: string | null;
  hidden: boolean;
};

export type Stack = {
  id: string;
  child: string | null;
};

export type BoardState = {
  cards: Record<string, Card>;
  stacks: Record<string, Stack>;
  stock: string[];
  waste: string[];
  foundation: Record<string, string[]>;
};
