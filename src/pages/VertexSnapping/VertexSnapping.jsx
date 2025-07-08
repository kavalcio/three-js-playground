import { useEffect, useRef } from 'react';

import { init } from './three';

export const VertexSnapping = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    const clearScene = init(rootRef.current);
    return () => {
      if (clearScene) clearScene();
    };
  }, []);

  return <div ref={rootRef} />;
};
