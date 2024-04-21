import { useEffect, useRef } from 'react';

// TODO: need to do a better job clearing scene when this is rendered, it gets remounted while developing
// TODO: crazy memory usage on mystify. do better memory cleanup in all demos
// TODO: do we need mui and emotion? remove them from package.json if not
export const Template = ({ demo }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    console.log('demo.init');
    demo.init(rootRef.current);
  }, [demo]);

  return <div ref={rootRef} />;
};
