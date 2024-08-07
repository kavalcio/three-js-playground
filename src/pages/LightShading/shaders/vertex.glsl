varying vec3 vNormal;
varying vec3 vModelPosition;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  vModelPosition = modelPosition.xyz;
}
