varying vec2 vUv;
varying vec3 vModelPosition;
varying vec3 vNormal;

uniform float uTime;
// uniform vec3 uColor;
uniform vec3 uLightDirection;
uniform sampler2D uDayMap;
uniform sampler2D uNightMap;
// uniform sampler2D uNormalMap;

void main()
{
  vec3 viewDirection = normalize(vModelPosition - cameraPosition);
  vec3 normal = normalize(vNormal);

  vec3 color = vec3(0.);

  // Evenly blend between day and night textures based on the UV coordinates
  float dayFactor = -dot(normal, uLightDirection);
  dayFactor = smoothstep(-0.25, 0.8, dayFactor);
  dayFactor = clamp(dayFactor, 0.0, 1.0);

  vec3 dayColor = texture(uDayMap, vUv).rgb;
  vec3 nightColor = texture(uNightMap, vUv).rgb;
  color = mix(nightColor, dayColor, dayFactor);

  gl_FragColor = vec4(color, 1.0);
  
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
