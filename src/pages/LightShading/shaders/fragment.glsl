uniform vec3 uColor;

varying vec3 vNormal;

#include ./utils/ambientLight.glsl
#include ./utils/directionalLight.glsl

void main()
{
  vec3 color = uColor;

  vec3 light;

  // Ambient light
  // light = ambientLight(
  //   vec3(1.0, 1.0, 1.0),
  //   0.05
  // );
  // color *= light;

  // Directional light
  light = directionalLight(
    vec3(1.0, 1.0, 1.0),
    vNormal,
    vec3(1.0, 1.0, 1.0),
    1.0
  );
  color *= light;

  // Final color
  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
