varying float distToCamera;

uniform vec3 uPlayerWorldPosition;

void main()
{
  vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
  // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  distToCamera = length(modelPosition.xyz - uPlayerWorldPosition);
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
