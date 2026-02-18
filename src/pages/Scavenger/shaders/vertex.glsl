varying float distToCamera;

void main()
{
  vec4 viewModelPosition = viewMatrix * modelMatrix * vec4(position, 1.0);
  distToCamera = -viewModelPosition.z;
  gl_Position = projectionMatrix * viewModelPosition;
}
