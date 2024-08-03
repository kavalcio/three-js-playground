uniform vec3 uModelColor;

uniform vec3 uAmbientColor;
uniform float uAmbientIntensity;

uniform vec3 uDirectionalColor;
uniform float uDirectionalDiffuseIntensity;
uniform float uDirectionalSpecularIntensity;
uniform float uDirectionalSpecularPower;
uniform vec3 uDirectionalPosition;

uniform vec3 uPointColor;
uniform float uPointDiffuseIntensity;
uniform float uPointSpecularIntensity;
uniform float uPointSpecularPower;
uniform vec3 uPointPosition;

varying vec3 vNormal;
varying vec3 vModelPosition;

#include ../../../shaders/lighting/ambientLight.glsl
#include ../../../shaders/lighting/directionalLight.glsl
#include ../../../shaders/lighting/pointLight.glsl

void main()
{
  vec3 color = uModelColor;

  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(vModelPosition - cameraPosition);

  vec3 light = vec3(0.);

  // Ambient light
  light += ambientLight(
    uAmbientColor,
    uAmbientIntensity
  );

  // Directional light
  light += directionalLight(
    uDirectionalPosition,           // Light position
    viewDirection,                  // View direction
    normal,                         // Normal
    uDirectionalColor,              // Light color
    uDirectionalDiffuseIntensity,   // Diffuse Light intensity
    uDirectionalSpecularIntensity,  // Specular Light intensity
    uDirectionalSpecularPower       // Specular power
  );

  // Point light
  light += pointLight(
    uPointPosition,                 // Light position
    vModelPosition,                 // Model position
    viewDirection,                  // View direction
    normal,                         // Normal
    uPointColor,                    // Light color
    uPointDiffuseIntensity,         // Diffuse Light intensity
    uPointSpecularIntensity,        // Specular Light intensity
    uPointSpecularPower             // Specular power
  );

  color *= light;

  // Final color
  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
