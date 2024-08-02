vec3 pointLight(
  vec3 lightPosition,
  vec3 modelPosition,
  vec3 viewDirection,
  vec3 normal,
  vec3 lightColor,
  float diffuseLightIntensity,
  float specularLightIntensity,
  float specularPower
) {
  vec3 lightDelta = lightPosition - modelPosition;
  vec3 lightDirection = normalize(lightDelta);
  float lightDistance = length(lightDelta);
  vec3 reflectedLightDirection = reflect(-lightDirection, normal);

  // Diffuse
  float diffuse = max(dot(lightDirection, normal), 0.0);

  // Specular
  float specular = max(-dot(reflectedLightDirection, viewDirection), 0.0);
  specular = pow(specular, specularPower);

  // Decay - Inverse square law
  float decay = 1.0 / (1.0 + 0.3 * lightDistance + 0.2 * lightDistance * lightDistance);

  return lightColor * decay * (diffuseLightIntensity * diffuse + specularLightIntensity * specular);
}
