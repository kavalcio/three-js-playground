import { useEffect, useRef } from 'react';

import { init } from './three';

// TODO: Loading this demo causes performance issues for the rest of the session in the whole app, why?
export const Galaxy = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    const clearScene = init(rootRef.current);
    return () => {
      if (clearScene) clearScene();
    };
  }, []);

  return <div ref={rootRef} />;
};
