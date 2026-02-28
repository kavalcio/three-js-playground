varying float vDistToCamera;
varying vec3 vModelPosition;
varying vec3 vNormal;

uniform float uFar;
uniform float uBand1Range;
uniform float uBand2Range;
uniform float uBand3Range;

uniform vec3 uFarColor;
uniform vec3 uBand1Color;
uniform vec3 uBand2Color;
uniform vec3 uBand3Color;
uniform vec3 uNearColor;

// const float gridFrequency = 0.2;
// const float gridThickness = 0.005;

void main () {
  float band1StartPoint = uFar - uBand1Range;
  float band2StartPoint = band1StartPoint - uBand2Range;
  float band3StartPoint = band2StartPoint - uBand3Range;
  float interpolatedDistance;
  vec4 col;

  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(vModelPosition - cameraPosition);
  float fresnel = 1. + dot(viewDirection, normal);
  fresnel = pow(fresnel, 4.0);
  
  // if (vDistToCamera > uFar) {
  //   col = vec4(0.);
  // } else 
  if (vDistToCamera > band1StartPoint) {
    interpolatedDistance = smoothstep(band1StartPoint, uFar, vDistToCamera);
    col = vec4(mix(uBand1Color, uFarColor, interpolatedDistance), 1.);
  } else if (vDistToCamera > band2StartPoint) {
    interpolatedDistance = smoothstep(band2StartPoint, band1StartPoint, vDistToCamera);
    col = vec4(mix(uBand2Color, uBand1Color, interpolatedDistance), 1.);
  } else if (vDistToCamera > band3StartPoint) {
    interpolatedDistance = smoothstep(band3StartPoint, band2StartPoint, vDistToCamera);
    col = vec4(mix(uBand3Color, uBand2Color, interpolatedDistance), 1.);
  } else {
    interpolatedDistance = smoothstep(0., band3StartPoint, vDistToCamera);
    col = vec4(mix(uNearColor, uBand3Color, interpolatedDistance), 1.);
  }

  // if (vDistToCamera <= uFar && (mod(vModelPosition.x, gridFrequency) <= gridThickness || mod(vModelPosition.y, gridFrequency) <= gridThickness)) {
  //   col = vec4(0., 0.7, 0., 1.);
  // }
  if (vDistToCamera <= uFar) {
    col = mix(col, vec4(1.), smoothstep(0., 7., fresnel));
  }
 
  gl_FragColor = col;

  #include <colorspace_fragment>
}
