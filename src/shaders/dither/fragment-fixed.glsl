#define USE_MAP true;
precision mediump float;

varying vec2 vUv;
uniform sampler2D uMap;

void main()
{
  vec4 color = texture2D(uMap, vUv);

  // https://en.wikipedia.org/wiki/Relative_luminance
  float brightness = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b);

  float thresholdValue = 0.5;

  gl_FragColor = (brightness) > thresholdValue ? vec4(0.85, 0.9, 0.85, 1.) : vec4(0.1, 0.15, 0.1, 1.);
}
