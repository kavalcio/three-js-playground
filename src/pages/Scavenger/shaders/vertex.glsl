varying float vDistToCamera;
varying vec3 vModelPosition;
varying vec3 vNormal;

uniform vec3 uPlayerWorldPosition;

void main()
{
  vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vModelPosition = modelPosition.xyz;
  vDistToCamera = length(modelPosition.xyz - uPlayerWorldPosition);
  vNormal = (modelMatrix * instanceMatrix * vec4(normal, 0.0)).xyz;
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
