#define USE_MAP true;
precision mediump float;

varying vec2 vUv;
uniform sampler2D uMap;
uniform float uResolution;
uniform int uPixellationMethodIndex;

void main()
{
  if (uPixellationMethodIndex == 0) {
    /* Method 1: Mean */
    vec2 centerUv = vec2(round(vUv.x * uResolution) / uResolution, round(vUv.y * uResolution) / uResolution);
    gl_FragColor = texture(uMap, centerUv);
  } else {
    /* Method 2: Median */
    vec2 centerUv = vec2(round(vUv.x * uResolution) / uResolution, round(vUv.y * uResolution) / uResolution);
    vec3 sumColor = vec3(0., 0., 0.);
    float sampleStepSize = 1. / (uResolution * 10.);
    float sampleStepCount = 0.;
    for (float x = max(centerUv.x - 1. / uResolution, 0.); x <= min(centerUv.x + 1. / uResolution, 1.); x += sampleStepSize) {
      for (float y = max(centerUv.y - 1. / uResolution, 0.); y <= min(centerUv.y + 1. / uResolution, 1.); y += sampleStepSize) {
        sumColor += texture(uMap, vec2(x, y)).rgb;
        sampleStepCount += 1.;
      }
    }
    gl_FragColor = vec4(sumColor.r / sampleStepCount, sumColor.g / sampleStepCount, sumColor.b / sampleStepCount, 1.);
  }
}
