varying vec2 vUv;

uniform float uTime;
uniform sampler2D uPerlinTexture;

void main()
{

  vec2 uv = vec2(vUv.x * 0.5, vUv.y * 0.3 - uTime / 15.);

  float intensity = texture2D(uPerlinTexture, uv).x;
  intensity = smoothstep(0.4, 1.0, intensity);
  
  intensity *= smoothstep(0.0, 0.1, vUv.x);
  intensity *= smoothstep(1.0, 0.9, vUv.x);

  intensity *= smoothstep(0.0, 0.1, vUv.y);
  intensity *= smoothstep(1.0, 0.4, vUv.y);


  gl_FragColor = vec4(1.0, 0.8, 0.6, intensity);
  
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
