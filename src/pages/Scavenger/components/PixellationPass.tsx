import { PixelationEffect } from 'postprocessing';
import { forwardRef, useMemo } from 'react';

export const PixellationPass = forwardRef(
  ({ granularity = 5 }: { granularity: number }, ref) => {
    const effect = useMemo(
      () => new PixelationEffect(granularity),
      [granularity],
    );
    return <primitive ref={ref} object={effect} dispose={null} />;
  },
);
