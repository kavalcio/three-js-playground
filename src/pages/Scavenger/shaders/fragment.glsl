// Check out https://github.com/mattdesl/webgl-wireframes for inspo

varying float distToCamera;

uniform float uFar;
uniform float uBand1Range;
uniform float uBand2Range;
uniform float uBand3Range;

uniform vec3 uFarColor;
uniform vec3 uBand1Color;
uniform vec3 uBand2Color;
uniform vec3 uBand3Color;
uniform vec3 uNearColor;

void main () {
  float band1StartPoint = uFar - uBand1Range;
  float band2StartPoint = band1StartPoint - uBand2Range;
  float band3StartPoint = band2StartPoint - uBand3Range;
  float interpolatedDistance;
  vec4 col;
  // if (distToCamera > uFar) {
  //   col = vec4(0.);
  // } else 
  if (distToCamera > band1StartPoint) {
    interpolatedDistance = smoothstep(band1StartPoint, uFar, distToCamera);
    col = vec4(mix(uBand1Color, uFarColor, interpolatedDistance), 1.);
  } else if (distToCamera > band2StartPoint) {
    interpolatedDistance = smoothstep(band2StartPoint, band1StartPoint, distToCamera);
    col = vec4(mix(uBand2Color, uBand1Color, interpolatedDistance), 1.);
  } else if (distToCamera > band3StartPoint) {
    interpolatedDistance = smoothstep(band3StartPoint, band2StartPoint, distToCamera);
    col = vec4(mix(uBand3Color, uBand2Color, interpolatedDistance), 1.);
  } else {
    interpolatedDistance = smoothstep(0., band3StartPoint, distToCamera);
    col = vec4(mix(uNearColor, uBand3Color, interpolatedDistance), 1.);
  }
  gl_FragColor = col;

  #include <colorspace_fragment>
}
