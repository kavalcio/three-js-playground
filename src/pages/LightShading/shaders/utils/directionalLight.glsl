vec3 directionalLight(vec3 lightPosition, vec3 normal, vec3 lightColor, float lightIntensity) {
  vec3 lightDirection = normalize(lightPosition);
  return lightColor * lightIntensity * dot(lightDirection, normal);
}
