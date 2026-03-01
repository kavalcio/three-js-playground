import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

import { DitherPass } from './DitherPass';
import { PixellationPass } from './PixellationPass';

export const Environment = () => {
  // TODO; remove these lights if not necessary
  return (
    <>
      <ambientLight color={0x404040} intensity={1.5} />
      <directionalLight
        color={0xffffff}
        intensity={1}
        position={[6, 4, 3]}
        castShadow
      />
      <EffectComposer>
        {/* <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        /> */}
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <PixellationPass granularity={2} />
        <Noise opacity={0.01} />
        <Vignette eskil={false} offset={0.05} darkness={1.05} opacity={0.7} />
        {/* <DitherPass /> */}
        <ToneMapping
          blendFunction={BlendFunction.NORMAL} // blend mode
          adaptive={true} // toggle adaptive luminance map usage
          resolution={256} // texture resolution of the luminance map
          middleGrey={0.6} // middle grey factor
          maxLuminance={56.0} // maximum luminance
          averageLuminance={24.0} // average luminance
          adaptationRate={1.0} // luminance adaptation rate
        />
      </EffectComposer>
    </>
  );
};
