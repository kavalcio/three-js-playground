#define USE_MAP true;
precision mediump float;

varying vec2 vUv;
uniform sampler2D uMap;
uniform float uResolution;

void main()
{
  vec2 sourceUv = vec2(round(vUv.x * uResolution) / uResolution, round(vUv.y * uResolution) / uResolution);
  gl_FragColor = texture(uMap, sourceUv);
}
