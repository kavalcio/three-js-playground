import { useState } from 'react';

import { GameStateHandler } from '../utils';

export const HUD = ({
  gameStateHandler,
  isPaused,
  setIsPaused,
  canvasRef,
}: {
  gameStateHandler: React.RefObject<GameStateHandler>;
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: isPaused ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          width: 200,
          height: 30,
          border: '2px solid white',
        }}
      >
        <div
          ref={gameStateHandler.current.healthBarDivRef}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'green',
          }}
        />
      </div>
      {isPaused && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontSize: '24px',
            flexDirection: 'column',
          }}
        >
          Game Paused
          <button
            onClick={async () => {
              await canvasRef.current?.requestPointerLock({
                unadjustedMovement: true,
              });
              setIsPaused(false);
            }}
          >
            resume
          </button>
        </div>
      )}
    </div>
  );
};
