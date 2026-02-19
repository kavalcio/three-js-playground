// Check out https://github.com/mattdesl/webgl-wireframes for inspo

varying float distToCamera;

uniform float uFar;
uniform float uBand1Range;
uniform float uBand2Range;

uniform vec3 uFarColor;
uniform vec3 uBand1Color;
uniform vec3 uBand2Color;
uniform vec3 uNearColor;

void main () {
  float band1StartPoint = uFar - uBand1Range;
  float band2StartPoint = band1StartPoint - uBand2Range;
  float interpolatedDistance;
  vec3 col;
  if (distToCamera > band1StartPoint) {
    interpolatedDistance = smoothstep(band1StartPoint, uFar, distToCamera);
    col = mix(uBand1Color, uFarColor, interpolatedDistance);
  } else if (distToCamera > band2StartPoint) {
    interpolatedDistance = smoothstep(band2StartPoint, band1StartPoint, distToCamera);
    col = mix(uBand2Color, uBand1Color, interpolatedDistance);
  } else {
    interpolatedDistance = smoothstep(0., band2StartPoint, distToCamera);
    col = mix(uNearColor, uBand2Color, interpolatedDistance);
  }
  gl_FragColor = vec4(col, 1.);

  #include <colorspace_fragment>
}
