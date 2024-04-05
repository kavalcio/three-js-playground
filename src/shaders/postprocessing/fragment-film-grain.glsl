#define USE_MAP true;
precision mediump float;

varying vec2 vUv;
uniform sampler2D uMap;
uniform float uTime;
uniform float uIntensity;

// Pseudo-random value generator from glsl-random: https://www.npmjs.com/package/glsl-random
float random(vec2 co, float time)
{
  float a = 12.9898;
  float b = 78.233;
  float c = 43758.5453;
  float dt = dot(co.xy, vec2(a, b)) * time;
  float sn = mod(dt, 3.14);
  return fract(sin(sn) * c);
}

void main()
{
  vec4 color = texture(uMap, vUv);
  float rand = (random(vUv, uTime) - 0.5) * uIntensity;
  gl_FragColor = vec4(vec3(rand), 1.0) + color;
}
