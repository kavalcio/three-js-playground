uniform vec3 uModelColor;
uniform vec3 uShadowColor;
uniform vec2 uResolution;
uniform bool uInvert;

varying vec3 vNormal;
varying vec3 vModelPosition;

#include ../../../shaders/lighting/ambientLight.glsl
#include ../../../shaders/lighting/directionalLight.glsl
#include ../../../shaders/misc/blendLinearLight.glsl

void main()
{
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(vModelPosition - cameraPosition);

  vec3 light = vec3(0.);

  vec3 color = uModelColor;

  // Ambient light
  light += ambientLight(
    vec3(1.),
    0.2
  );

  // Directional light
  light += directionalLight(
    vec3(1.),           // Light position
    viewDirection,      // View direction
    normal,             // Normal
    vec3(1.),           // Light color
    1.3,                // Diffuse Light intensity
    1.2,                // Specular Light intensity
    15.                 // Specular power
  );

  color *= light;

  // Halftone
  float repetitions = 70.;
  vec2 uv = gl_FragCoord.xy / uResolution.y;
  uv = mod(uv * repetitions, 1.);

  float circlePattern = (1. - distance(vec2(0.5), uv));
  float brightness = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b);

  // TODO: change step function threshold based on brightness of uModelColor
  if (uInvert) {
    float invertedBlendedBrightness = blendLinearLight(circlePattern, 1. - brightness);
    float invertedHalftone = step(0.95, invertedBlendedBrightness);

    color = mix(color, uShadowColor, invertedHalftone);
  } else {
    float blendedBrightness = blendLinearLight(circlePattern, brightness);
    float halftone = step(0.3, blendedBrightness);

    color = mix(color, uShadowColor, 1. - halftone);
  }

  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
