import * as THREE from 'three';

import { initializeScene } from 'src/utils/template';

// https://open-meteo.com/en/docs/

const init = (root) => {
  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
  });

  const tick = () => {
    stats.begin();
    requestAnimationFrame(tick);
    stats.end();
  };

  tick();
};

export default { init };
