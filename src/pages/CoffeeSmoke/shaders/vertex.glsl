#define M_PI 3.1415926535897932384626433832795

varying vec2 vUv;

uniform float uTime;
uniform sampler2D uPerlinTexture;

#include ./rotate2D.glsl

void main()
{
  vUv = uv;

  vec3 newPosition = position;
  float angle = texture(
    uPerlinTexture,
    vec2(0.5, uv.y * 0.3 + uTime * 0.02
  )).x * 7.;
  newPosition.xz = rotate2D(position.xz, angle);

  vec2 windOffset = vec2(
    texture(uPerlinTexture, vec2(0.2, uTime * 0.02)).x - 0.5,
    texture(uPerlinTexture, vec2(0.7, uTime * 0.02)).x - 0.5
  );

  newPosition.xz += windOffset * pow(uv.y, 2.) * 8.;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
}
