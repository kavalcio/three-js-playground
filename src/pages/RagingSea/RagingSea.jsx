import { useEffect, useRef, useState } from 'react';

import { InfoModal } from '@/components';

import { init } from './three';

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
