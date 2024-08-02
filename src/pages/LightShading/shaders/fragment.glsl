uniform vec3 uColor;
uniform float uSpecularPower;

varying vec3 vNormal;
varying vec3 vModelPosition;

#include ./utils/ambientLight.glsl
#include ./utils/directionalLight.glsl

void main()
{
  vec3 color = uColor;

  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(vModelPosition - cameraPosition);

  vec3 light = vec3(0.);

  // Ambient light
  light += ambientLight(
    vec3(1.0, 1.0, 1.0),
    0.05
  );

  // Directional light
  light += directionalLight(
    vec3(0.0, 0.0, 3.0),  // Light position
    viewDirection,        // View direction
    normal,               // Normal
    vec3(1.0, 1.0, 1.0),  // Light color
    1.0,                  // Light intensity
    uSpecularPower        // Specular power
  );

  color *= light;

  // Final color
  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
