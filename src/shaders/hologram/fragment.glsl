varying vec2 vUv;
varying vec3 vModelPosition;
varying vec3 vNormal;

uniform float uTime;
uniform vec3 uColor;

void main()
{
  float stripes = mod((vModelPosition.y - uTime * 0.1) * 15., 1.0);
  stripes = pow(stripes, 3.0);

  vec3 viewDirection = normalize(vModelPosition - cameraPosition);

  vec3 normal = normalize(vNormal);
  if (!gl_FrontFacing) {
    normal = -normal;
  }

  float fresnel = 1. + dot(viewDirection, normal);
  fresnel = pow(fresnel, 2.0);

  float falloff = smoothstep(0.8, 0.0, fresnel);

  float intensity = (stripes + 1.) * fresnel * falloff;

  gl_FragColor = vec4(uColor, intensity);
  
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
