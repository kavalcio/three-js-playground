import { useEffect, useRef } from 'react';

import { init } from './three';

// TODO: use glslify
// https://github.com/jamieowen/glsl-blend
export const Halftone = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    init(rootRef.current);
  }, []);

  return <div ref={rootRef} />;
};
