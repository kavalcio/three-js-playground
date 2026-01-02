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
