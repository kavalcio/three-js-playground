varying vec2 vUv;
varying vec3 vModelPosition;
varying vec3 vNormal;

uniform float uTime;

void main()
{
  float stripes = mod(vModelPosition.y - uTime * 0.1, 0.1) * 10.;

  vec3 viewDirection = normalize(vModelPosition - cameraPosition);

  vec3 normal = normalize(vNormal);
  if (!gl_FrontFacing) {
    normal *= - 1.0;
  }
  float fresnel = dot(viewDirection, normal) + 1.;

  float intensity = stripes * fresnel;

  gl_FragColor = vec4(vec3(1.), intensity);
  
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
