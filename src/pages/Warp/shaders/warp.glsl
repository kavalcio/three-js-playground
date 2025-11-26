#define USE_MAP true;
precision mediump float;

varying vec2 vUv;
uniform sampler2D uMap1;
uniform sampler2D uMap2;
uniform vec2 uResolution;
uniform float uTime;

// TODO: get rid of black line at the edge
// TODO: fix image upload
// TODO: try to match the wave effect more closely
// TODO: add uniforms to tweak speed, glitch amplitude, etc.
void main()
{
  // float wave = sin(uTime * .5 + vUv.x) * 2.;
  // float wave = 4. * sin(uTime / 3. + vUv.x) + sin(uTime * 2. + vUv.x);
  // float wave = 2. * sin(uTime / 3. + vUv.x);
  // float wave = sin(uTime / 3. + vUv.x)*4.;
  // float wave = 2. * sin((uTime+vUv.x)*.5) + 0.5 * cos(uTime*2.+vUv.x * 2.) + .1*sin((uTime+vUv.x)*10.);
  float wave = 2. * sin(-uTime / 3. + vUv.x);
  
  // float glitch = round(mod(vUv.x * 100., 1.)) * 0.02;
  float glitch = 0.02 * step(0.5, mod(vUv.x * 100., 1.));
  
  wave = wave + glitch;
  wave = clamp(wave, -1., 1.);

  // vec2 sampleUv =  vUv + vec2(wavePosition, 0.);
  vec2 sampleUv =  vec2(vUv.x * wave, vUv.y);
  sampleUv.x = mod(sampleUv.x, 1.);

  vec3 col;
  if (wave > 0.) {
    col = texture2D(uMap1, sampleUv).rgb;
  } else {
    col = texture2D(uMap2, sampleUv).rgb;
  }
  // gl_FragColor = vec4(vec3(sampleUv.x),1.0);
  gl_FragColor = vec4(col, 1.0);
}
