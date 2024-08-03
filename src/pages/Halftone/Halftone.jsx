import { useEffect, useRef } from 'react';

import { init } from './three';

export const Halftone = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    init(rootRef.current);
  }, []);

  return <div ref={rootRef} />;
};
