import { useEffect, useRef } from 'react';

import { init } from './three';

// TODO: Loading this demo causes performance issues for the rest of the session in the whole app, why?
export const Galaxy = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    init(rootRef.current);
  }, []);

  return <div ref={rootRef} />;
};
