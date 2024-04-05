#define USE_MAP true;
precision mediump float;

varying vec2 vUv;
uniform sampler2D uMap;
uniform float uChromaticAberrationOffset;

void main()
{
  vec2 offset = uChromaticAberrationOffset * (vUv - vec2(0.5));
  float r = texture(uMap, vUv + vec2(offset.x, offset.y)).r;
  float g = texture(uMap, vUv).g;
  float b = texture(uMap, vUv - vec2(offset.x, offset.y)).b;
  gl_FragColor = vec4(r, g, b, 1.0);
}
