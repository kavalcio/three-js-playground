#define USE_MAP true;
precision mediump float;

varying vec2 vUv;
uniform sampler2D uMap;
uniform float uAspectRatio;
uniform float uResolution;
uniform int uPixellationMethodIndex;

void main()
{
  vec2 centerUv = vec2(round(vUv.x * uResolution * uAspectRatio) / (uResolution * uAspectRatio), round(vUv.y * uResolution) / (uResolution));
  if (uPixellationMethodIndex == 0) {
    /* Method 1: Mean */
    gl_FragColor = texture(uMap, centerUv);
  } else {
    /* Method 2: Median */
    vec3 sumColor = vec3(0., 0., 0.);
    vec2 sampleStepSize = vec2(1. / (uResolution * uAspectRatio * 10.), 1. / (uResolution * 10.));
    float sampleStepCount = 0.;
    for (float x = max(centerUv.x - 1. / (uResolution * uAspectRatio), 0.); x <= min(centerUv.x + 1. / (uResolution * uAspectRatio), 1.); x += sampleStepSize.x) {
      for (float y = max(centerUv.y - 1. / uResolution, 0.); y <= min(centerUv.y + 1. / uResolution, 1.); y += sampleStepSize.y) {
        sumColor += texture(uMap, vec2(x, y)).rgb;
        sampleStepCount += 1.;
      }
    }
    gl_FragColor = vec4(sumColor.r / sampleStepCount, sumColor.g / sampleStepCount, sumColor.b / sampleStepCount, 1.);
  }

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
