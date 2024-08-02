vec3 directionalLight(
  vec3 lightPosition,
  vec3 viewDirection,
  vec3 normal,
  vec3 lightColor,
  float diffuseLightIntensity,
  float specularLightIntensity,
  float specularPower
) {
  vec3 lightDirection = normalize(lightPosition);
  vec3 reflectedLightDirection = reflect(-lightDirection, normal);

  // Diffuse
  float diffuse = max(dot(lightDirection, normal), 0.0);

  // Specular
  float specular = max(-dot(reflectedLightDirection, viewDirection), 0.0);
  specular = pow(specular, specularPower);

  return lightColor * (diffuseLightIntensity * diffuse + specularLightIntensity * specular);
}
