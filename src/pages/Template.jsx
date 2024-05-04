import { useEffect, useRef } from 'react';

export const Template = ({ demo }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    console.log('demo.init');
    demo.init(rootRef.current);
  }, [demo]);

  return <div ref={rootRef} />;
};
