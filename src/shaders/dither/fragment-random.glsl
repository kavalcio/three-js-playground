#define USE_MAP true;
precision mediump float;

varying vec2 vUv;
uniform sampler2D uMap;
uniform vec3 uBrightColor;
uniform vec3 uDarkColor;

float random(vec2 uv)
{
  return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
  vec4 color = texture2D(uMap, vUv);

  // https://en.wikipedia.org/wiki/Relative_luminance
  float brightness = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b);

  float thresholdValue = random(vUv);

  gl_FragColor = (brightness) > thresholdValue ? vec4(uBrightColor, 1.) : vec4(uDarkColor, 1.);
}
