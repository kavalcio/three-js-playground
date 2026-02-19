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
  vec3 col;
  if (distToCamera > band1StartPoint) {
    interpolatedDistance = smoothstep(band1StartPoint, uFar, distToCamera);
    col = mix(uBand1Color, uFarColor, interpolatedDistance);
  } else if (distToCamera > band2StartPoint) {
    interpolatedDistance = smoothstep(band2StartPoint, band1StartPoint, distToCamera);
    col = mix(uBand2Color, uBand1Color, interpolatedDistance);
  } else if (distToCamera > band3StartPoint) {
    interpolatedDistance = smoothstep(band3StartPoint, band2StartPoint, distToCamera);
    col = mix(uBand3Color, uBand2Color, interpolatedDistance);
  } else {
    interpolatedDistance = smoothstep(0., band3StartPoint, distToCamera);
    col = mix(uNearColor, uBand3Color, interpolatedDistance);
  }
  gl_FragColor = vec4(col, 1.);

  #include <colorspace_fragment>
}
