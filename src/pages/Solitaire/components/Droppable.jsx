import { useDroppable } from '@dnd-kit/core';

export const Droppable = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const style = {
    color: isOver ? 'green' : undefined,
    padding: '20px',
    margin: '20px',
    border: '2px solid white',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};
