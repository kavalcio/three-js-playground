import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Box, Dialog } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import Confetti from 'react-confetti-boom';

import { FOUNDATION_DROPPABLE_ID } from '@/constants';
import { BoardState } from '@/types';
import {
  flattenStacks,
  initializeSolitaireBoard,
  insertCardFoundation,
  insertCardTableau,
} from '@/utils';

import {
  Droppable,
  Foundation,
  MenuBar,
  NewGameConfirmation,
  Stock,
  VictoryScreen,
  Waste,
} from './components';

const MOVE_HISTORY_LENGTH = 10;

// TODO: page scrolling is weird, fix it
// TODO: do an early detection of win condition when all cards are revealed and removed from the stock
// TODO: use balatro skin, allow picking between different card backs
// TODO: add a context provider for state instead of passing it around as props
// TODO: do easy and hard mode where you either draw 1 or 3 cards at a time
export const Solitaire = () => {
  const [state, setState] = useState<BoardState>(initializeSolitaireBoard);
  const [moveHistory, setMoveHistory] = useState<BoardState[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [isVictory, setIsVictory] = useState(false);
  const [showNewGameConfirmation, setShowNewGameConfirmation] = useState(false);

  // Keep track of stack whose child is being dragged, so we can increase its z-index
  const [activeDraggedStackId, setActiveDraggedStackId] = useState<
    string | null
  >(null);

  const { cards, stacks, stock, waste, foundation } = state;

  const updateState = (oldState: BoardState, newState: BoardState) => {
    setMoveHistory((prev) => [...prev, oldState].slice(-MOVE_HISTORY_LENGTH));
    setMoveCount((prev) => prev + 1);
    setState(newState);
  };

  useEffect(() => {
    // Show win screen if win all cards are collected
    const foundationCardCount = Object.values(state.foundation).reduce(
      (acc, f) => acc + f.length,
      0,
    );
    if (foundationCardCount >= 52) {
      setIsVictory(true);
    }
  }, [state, setIsVictory]);

  const flattenedStacks = useMemo(() => {
    return flattenStacks(state.stacks, state.cards);
  }, [state]);

  const sortedStackIds = useMemo(() => {
    return Object.keys(stacks).sort((a, b) => a.localeCompare(b));
  }, [stacks]);

  const handleDragStart = (event: DragEndEvent) => {
    console.log('handleDragStart', event);
    const cardId = event.active.id;
    const parentStackIndex = flattenedStacks.findIndex((stack) =>
      stack.some((c) => c === cardId),
    );
    if (parentStackIndex === -1) return;
    const parentStackId = sortedStackIds[parentStackIndex];
    setActiveDraggedStackId(parentStackId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('handleDragEnd', event);
    setActiveDraggedStackId(null);
    if (!event.over) return;
    const draggedCardId = event.active.id as string;
    const droppedStackId = event.over.id as string;

    let newState;
    if (droppedStackId === FOUNDATION_DROPPABLE_ID) {
      newState = insertCardFoundation({
        stacks,
        cards,
        waste,
        foundation,
        draggedCardId,
      });
    } else {
      newState = insertCardTableau({
        stacks,
        cards,
        waste,
        draggedCardId,
        droppedStackId,
      });
    }
    if (!newState) return;
    const combinedState = {
      ...state,
      ...newState,
    };
    updateState(state, combinedState);
  };

  console.log('state', {
    cards,
    stacks,
    waste,
    stock,
    foundation,
    flattenedStacks,
    moveHistory,
  });

  const onDrawCard = () => {
    if (stock.length === 0) {
      // Reset waste into stock when finished
      const newWaste: string[] = [];
      const newStock: string[] = [...waste].reverse(); // Reverse to maintain order
      const newCards = { ...cards };
      newStock.forEach((cardId) => {
        newCards[cardId] = {
          ...newCards[cardId],
          hidden: true, // Hide the card when added back to stock
        };
      });
      updateState(state, {
        ...state,
        stock: newStock,
        waste: newWaste,
        cards: newCards,
      });
      return;
    }
    // Draw a card from the stock
    const newWaste = [...waste, stock[stock.length - 1]];
    const newStock = stock.slice(0, stock.length - 1);
    const newCards = { ...cards };
    newCards[stock[stock.length - 1]] = {
      ...cards[stock[stock.length - 1]],
      hidden: false, // Reveal the card when drawn
    };
    updateState(state, {
      ...state,
      stock: newStock,
      waste: newWaste,
      cards: newCards,
    });
  };

  const createNewGame = () => {
    const output = initializeSolitaireBoard();
    setState(output);
    setMoveHistory([]);
    setIsVictory(false);
    setMoveCount(0);
    setShowNewGameConfirmation(false);
  };

  const onNewGame = () => {
    if (moveCount > 0 && !isVictory) {
      // Show confirmation dialog if user is in the middle of a game
      setShowNewGameConfirmation(true);
      return;
    }
    createNewGame();
  };

  const onUndoMove = () => {
    setState(moveHistory[moveHistory.length - 1]);
    setMoveHistory((prev) => prev.slice(0, moveHistory.length - 1));
    setMoveCount((prev) => prev - 1);
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      modifiers={[restrictToWindowEdges]}
    >
      <Box
        sx={{
          backgroundColor: 'green',
          height: '100vh',
          width: '100vw',
          overflowX: 'hidden',
        }}
      >
        <MenuBar
          setIsVictory={setIsVictory}
          moveCount={moveCount}
          onNewGame={onNewGame}
          onUndoMove={onUndoMove}
          hasMovesToUndo={moveHistory.length > 0}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 4,
            pt: 5,
            gap: 2,
            mx: 'auto',
            width: 'fit-content',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 5,
              flexWrap: 'wrap',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Stock onDrawCard={onDrawCard} stock={stock} />
              <Waste cards={cards} waste={waste} />
            </Box>
            <Box
              sx={{
                ml: { xs: 0, sm: 'auto' },
                mr: { xs: 'auto', sm: 0 },
              }}
            >
              <Foundation foundation={state.foundation} cards={state.cards} />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            {sortedStackIds.map((stackId, index) => (
              <Droppable
                key={stackId}
                id={stackId}
                cardCount={flattenedStacks[index].length}
                stacks={stacks}
                cards={cards}
                isDraggingChild={activeDraggedStackId === stackId}
              />
            ))}
          </Box>
        </Box>
      </Box>
      <Dialog open={isVictory} transitionDuration={0}>
        <VictoryScreen onNewGame={onNewGame} moveCount={moveCount} />
      </Dialog>
      {isVictory && <Confetti mode="fall" style={{ zIndex: 10001 }} />}
      <Dialog
        open={showNewGameConfirmation}
        transitionDuration={0}
        onClose={() => setShowNewGameConfirmation(false)}
      >
        <NewGameConfirmation
          onCancel={() => setShowNewGameConfirmation(false)}
          onConfirm={createNewGame}
        />
      </Dialog>
    </DndContext>
  );
};
