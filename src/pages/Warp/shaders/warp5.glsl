#define USE_MAP true;
precision mediump float;

varying vec2 vUv;
uniform sampler2D uMap1;
uniform sampler2D uMap2;
uniform vec2 uResolution;
uniform float uTime;

void main()
{
  // vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 uv = vUv;
  
  //float wave = sin(uTime * .5 + uv.x) * 2.;
  // float wave = 4.*sin((uTime+uv.x)*.5) + sin(uTime*2.+uv.x) + .2*sin((uTime+uv.x)*50.);
  // float wave = 4. * sin(uTime / 3. + uv.x) + sin(uTime * 2. + uv.x);
  // float wave = 2. * sin(uTime / 3. + uv.x);
  float wave = 2. * sin(uTime + uv.x);
  // float wave = sin(uTime / 3. + uv.x)*4.;

  // float glitchOffset = sin(uv.x * 200.) / 5.;
  // float glitchOffset = mod(uv.x * 50., 1.) / 5.;
  float glitchOffset = round(mod(uv.x * 100., 1.)) * 0.05;
  //float glitchOffset = round(mod(fragCoord.x, 2.)) / 5.;
  
  float wavePosition = wave;// + glitchOffset;
  // float wavePosition = wave + glitchOffset;

  // wavePosition = min(max(wavePosition, -1.), 1.);
  wavePosition = clamp(wavePosition, -1., 1.);


  //vec3 col = wavePosition > 0. ? texture(uMap1, uv).rgb : texture(uMap2, uv).rgb;
  //vec3 col = wavePosition > 0. ? texture(uMap1, uv).rgb : texture(uMap1, uv + vec2(0.05, 0.)).rgb;
  //vec3 col = texture(uMap1, uv + vec2(min(0., wavePosition), 0.)).rgb;
  //vec3 col = texture(uMap1, uv + vec2(wavePosition, 0.)).rgb;
  //vec3 col = texture(wavePosition > 0. ? uMap1 : uMap2, sampleUv).rgb;
  // vec2 sampleUv =  uv + vec2(wavePosition, 0.);
  // sampleUv.x = mod(abs(sampleUv.x), 1.);
  
  vec2 sampleUv =  vec2(uv.x * wavePosition, uv.y);
  sampleUv.x = mod(sampleUv.x, 1.);
  vec3 col;
  if (wavePosition > 0.) {
    col = texture2D(uMap1, sampleUv).rgb;
  } else {
    col = texture2D(uMap2, sampleUv).rgb;
  }

  // Output to screen
  // gl_FragColor = vec4(vec3(sampleUv.x),1.0);
  // gl_FragColor = vec4(wavePosition,-wavePosition,0.,1.0);
  gl_FragColor = vec4(col, 1.0);
}
