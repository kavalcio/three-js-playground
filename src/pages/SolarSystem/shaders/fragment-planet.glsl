varying vec2 vUv;
varying vec3 vModelPosition;
varying vec3 vNormal;

uniform float uTime;
uniform float uCloudDensity;
uniform float uCloudIntensity;

uniform vec3 uLightDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

uniform sampler2D uDayMap;
uniform sampler2D uNightMap;
uniform sampler2D uCloudsMap;
// uniform sampler2D uNormalMap;

void main()
{
  vec3 viewDirection = normalize(vModelPosition - cameraPosition);
  vec3 normal = normalize(vNormal);

  vec3 color = vec3(0.);

  // Compute day color (incuding clouds)
  vec3 dayColor = texture(uDayMap, vUv).rgb;
  float cloudFactor = smoothstep(1. - uCloudDensity, 1.0, texture(uCloudsMap, vUv).r) * uCloudIntensity;
  dayColor = mix(dayColor, vec3(1.0), cloudFactor);

  // Compute night color
  vec3 nightColor = texture(uNightMap, vUv).rgb;

  float sunOrientation = -dot(normal, uLightDirection);

  // Evenly blend between day and night textures based on the UV coordinates
  float dayFactor = smoothstep(-0.25, 0.8, sunOrientation);
  dayFactor = clamp(dayFactor, 0.0, 1.0);
  color = mix(nightColor, dayColor, dayFactor);

  // Add a slight atmospheric effect
  float atmosphereDayFactor = smoothstep(-0.5, 1.0, sunOrientation);
  atmosphereDayFactor = clamp(atmosphereDayFactor, 0.0, 1.0);
  vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayFactor);
  float fresnel = 1. + dot(viewDirection, normal);
  color = mix(color, atmosphereColor, pow(fresnel, 3.) * atmosphereDayFactor);

  gl_FragColor = vec4(color, 1.0);
  
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
