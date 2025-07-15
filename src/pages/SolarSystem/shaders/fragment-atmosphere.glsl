varying vec2 vUv;
varying vec3 vModelPosition;
varying vec3 vNormal;

uniform vec3 uLightDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

void main()
{
  vec3 viewDirection = normalize(vModelPosition - cameraPosition);
  vec3 normal = normalize(vNormal);

  vec3 color = vec3(0.);

  float sunOrientation = -dot(normal, uLightDirection);

  float atmosphereDayFactor = smoothstep(-0.5, 1.0, sunOrientation);
  vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayFactor);

  // Fade atmosphere at the edges and on the dark side
  float fresnel = dot(viewDirection, normal);
  float edgeAlpha = smoothstep(0.0, 0.5, fresnel);
  float dayAlpha = smoothstep(-0.5, 0.4, sunOrientation);
  float alpha = edgeAlpha * dayAlpha;

  gl_FragColor = vec4(atmosphereColor, alpha);
  
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
