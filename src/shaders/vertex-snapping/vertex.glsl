// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;

// attribute vec3 position;
// varying vec2 vUv;

void main()
{
  // vUv = uv;

  // ----
  // vec3 snappedPosition = vec3(floor(position.x), floor(position.y), floor(position.z));
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(snappedPosition, 1.0);

  // vec3 origPosition = (projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0)).xyz;
  // gl_Position = vec4(origPosition.x, origPosition.y, origPosition.z, 1.0);

  // -----

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  modelPosition = vec4(floor(modelPosition.x), floor(modelPosition.y), floor(modelPosition.z), modelPosition.w);

  vec4 viewPosition = viewMatrix * modelPosition;

  gl_Position = projectionMatrix * viewPosition;
}
