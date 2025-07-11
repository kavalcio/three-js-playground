varying vec2 vUv;
varying vec3 vModelPosition;
varying vec3 vNormal;

uniform float uTime;


float random(vec2 uv)
{
  return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float glitchTime = uTime - modelPosition.y;
  float glitchStrength = (sin(glitchTime) + sin(glitchTime * 3.25) + sin(glitchTime * 7.76)) / 3.;
  glitchStrength = smoothstep(0.5, 1.0, glitchStrength) * 0.3;
  modelPosition.x += (random(modelPosition.xz + uTime) - 0.5) * glitchStrength;
  modelPosition.z += (random(modelPosition.zx + uTime) - 0.5) * glitchStrength;

  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  vUv = uv;
  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  vModelPosition = modelPosition.xyz;
}
