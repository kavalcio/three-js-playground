import { GameStateHandler } from '../utils';

export const HUD = ({
  gameStateHandler,
}: {
  gameStateHandler: React.RefObject<GameStateHandler>;
}) => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
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
    </div>
  );
};
