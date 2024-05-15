import { useEffect, useRef, useState } from 'react';

import { init } from './three';
import { InfoModal } from '@/components';

export const RagingSea = () => {
  const rootRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    init({ root: rootRef.current, onModalOpen: () => setIsModalOpen(true) });
  }, []);

  return (
    <>
      <div ref={rootRef} />
      <InfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={'Raging Sea'}
      >
        A custom shader that simulates a wavy sea.
      </InfoModal>
    </>
  );
};
