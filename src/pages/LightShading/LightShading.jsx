import { useEffect, useRef } from 'react';

import { init } from './three';

export const LightShading = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    init(rootRef.current);
  }, []);

  return <div ref={rootRef} />;
};
