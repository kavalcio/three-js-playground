varying vec2 vUv;
uniform sampler2D uMap1;
uniform sampler2D uMap2;
uniform float uTime;

// TODO: normalize image sizes
void main()
{
  float t = uTime;
  float wave = -2. * sin((t + vUv.x)*.5)
    + 0.2 * cos(t * 2. + vUv.x * 2.)
    + .1 * sin((t + vUv.x) * 10.);
  float glitch = 0.01 * step(0.5, mod(vUv.x * 100., 1.));
  
  // Combine wave and glitch effect
  wave += glitch;

  // Clamp to create "dead zones" where no transition effect is applied
  wave = clamp(wave, -1., 1.);

  // Offset UV based on the wave value
  vec2 sampleUv =  vec2(vUv.x * wave, vUv.y);
  sampleUv.x = mod(abs(sampleUv.x), 1.); // Ensure UV wraps around
  
  // Switch between two textures based on the wave value
  vec3 col;
  vec3 col1 = texture(uMap1, sampleUv).rgb;
  vec3 col2 = texture(uMap2, sampleUv).rgb;
  col = mix(col1, col2, step(0., wave));

  gl_FragColor = vec4(col, 1.0);
}
