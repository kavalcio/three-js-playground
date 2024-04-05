import { useEffect, useRef } from 'react';

// TODO: canvas is not always full screen, fix that
// TODO: need to do a better job clearing scene when this is refreshed, it gets remounted while developing
// TODO: crazy memory usage on mystify
export const Template = ({ initializer }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    console.log('root', rootRef.current);
    initializer(rootRef.current);
  }, [initializer]);

  return <div ref={rootRef} />;
};
