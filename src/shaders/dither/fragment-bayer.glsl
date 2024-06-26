#define USE_MAP true;
precision mediump float;

varying vec2 vUv;

uniform sampler2D uMap;
uniform float[256] uThresholdArray;
uniform int uThresholdMatrixWidth;
uniform vec3 uBrightColor;
uniform vec3 uDarkColor;

void main()
{
  vec4 color = texture(uMap, vUv);

  // https://en.wikipedia.org/wiki/Relative_luminance
  float brightness = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b);
  
  int thresholdArrayIndex = int(mod(gl_FragCoord.x, float(uThresholdMatrixWidth))) * uThresholdMatrixWidth + int(mod(gl_FragCoord.y, float(uThresholdMatrixWidth)));
  float thresholdValue = uThresholdArray[thresholdArrayIndex];

  gl_FragColor = (brightness) > 1. - thresholdValue ? vec4(uBrightColor, 1.) : vec4(uDarkColor, 1.);
}
