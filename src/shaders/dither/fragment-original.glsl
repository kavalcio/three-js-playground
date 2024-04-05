#define USE_MAP true;
precision mediump float;

varying vec2 vUv;
uniform sampler2D uMap;

void main()
{
  vec4 color = texture2D(uMap, vUv);
  gl_FragColor = color;
}
