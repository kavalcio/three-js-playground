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

  int thresholdArrayIndex = int(mod(gl_FragCoord.x, float(uThresholdMatrixWidth))) * uThresholdMatrixWidth + int(mod(gl_FragCoord.y, float(uThresholdMatrixWidth)));
  float thresholdValue = uThresholdArray[thresholdArrayIndex];

  float r = (color.r) > 1. - thresholdValue ? 1. : 0.;
  float g = (color.g) > 1. - thresholdValue ? 1. : 0.;
  float b = (color.b) > 1. - thresholdValue ? 1. : 0.;
  gl_FragColor = vec4(r, g, b, 1.0);
}
