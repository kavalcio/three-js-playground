import { useDraggable } from '@dnd-kit/core';

// TODO: You'll likely want to alter the z-index of your Draggable component to ensure it appears on top of other elements.
export const Draggable = (props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
};
