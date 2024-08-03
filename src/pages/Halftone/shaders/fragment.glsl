uniform vec3 vModelColor;

varying vec3 vNormal;
varying vec3 vModelPosition;

#include ../../../shaders/lighting/ambientLight.glsl
#include ../../../shaders/lighting/directionalLight.glsl

void main()
{
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(vModelPosition - cameraPosition);

  vec3 light = vec3(0.);

  vec3 color = vModelColor;

  // Ambient light
  light += ambientLight(
    vec3(1.),
    0.2
  );

  // Directional light
  light += directionalLight(
    vec3(1.),           // Light position
    viewDirection,                  // View direction
    normal,                         // Normal
    vec3(1.),              // Light color
    0.9,   // Diffuse Light intensity
    1.2,  // Specular Light intensity
    15.       // Specular power
  );

  color *= light;

  // Halftone
  // vec2 

  // Final color
  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
