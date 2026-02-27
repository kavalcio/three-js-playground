import { Effect } from 'postprocessing';
import { forwardRef, useMemo } from 'react';
import { Uniform } from 'three';

import { getNormalizedBayerMatrix } from '@/utils/misc';

const fragmentShader = `
  uniform float[256] uThresholdArray;
  uniform int uThresholdMatrixWidth;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
  {
    vec3 color = inputColor.rgb;

    int thresholdArrayIndex = int(mod(gl_FragCoord.x, float(uThresholdMatrixWidth))) * uThresholdMatrixWidth + int(mod(gl_FragCoord.y, float(uThresholdMatrixWidth)));
    float thresholdValue = uThresholdArray[thresholdArrayIndex];

    float r = (color.r) > 1. - thresholdValue ? 1. : 0.;
    float g = (color.g) > 1. - thresholdValue ? 1. : 0.;
    float b = (color.b) > 1. - thresholdValue ? 1. : 0.;
    outputColor = vec4(r, g, b, 1.0);
  }
`;

const fragmentShaderAlt = `
  uniform float[256] uThresholdArray;
  uniform int uThresholdMatrixWidth;

  const vec3 uBrightColor = vec3(0.9, 0.3, 0.5);
  const vec3 uDarkColor = vec3(0.05, 0.1, 0.);

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
  {
    vec3 color = inputColor.rgb;

    float brightness = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b);
    int thresholdArrayIndex = int(mod(gl_FragCoord.x, float(uThresholdMatrixWidth))) * uThresholdMatrixWidth + int(mod(gl_FragCoord.y, float(uThresholdMatrixWidth)));

    float thresholdValue = uThresholdArray[thresholdArrayIndex];

    outputColor = (brightness) > 1. - thresholdValue ? vec4(uBrightColor, 1.) : vec4(uDarkColor, 1.);
  }
`;

const bayerOrder = 3;

// Effect implementation
class DitherEffect extends Effect {
  constructor() {
    super('DitherEffect', fragmentShaderAlt, {
      uniforms: new Map([
        ['uThresholdArray', new Uniform(getNormalizedBayerMatrix(bayerOrder))],
        ['uThresholdMatrixWidth', new Uniform(Math.pow(2, bayerOrder + 1))],
      ]),
    });
  }
}

// Effect component
export const DitherPass = forwardRef((_, ref) => {
  const effect = useMemo(() => new DitherEffect(), []);
  return <primitive ref={ref} object={effect} dispose={null} />;
});
