varying vec2 vUv;
varying vec3 vColor;

uniform float uTime;
uniform float uRotationSpeed;

attribute float aSize;
attribute vec3 aPositionRandomness;

void main() {
  vUv = uv;
  vColor = color;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Rotate the point
  float distanceToCenter = length(modelPosition.xz);
  float angle = atan(modelPosition.z, modelPosition.x);
  float angleOffset = uTime * uRotationSpeed / distanceToCenter;
  angle += angleOffset;
  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  modelPosition.xyz += aPositionRandomness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  
  gl_PointSize = (aSize / -viewPosition.z);
}
