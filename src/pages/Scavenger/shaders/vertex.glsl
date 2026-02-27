varying float vDistToCamera;
varying vec3 vModelPosition;

uniform vec3 uPlayerWorldPosition;

void main()
{
  vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vModelPosition = modelPosition.xyz;
  vDistToCamera = length(modelPosition.xyz - uPlayerWorldPosition);
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
