// Check out https://github.com/mattdesl/webgl-wireframes for inspo

varying float distToCamera;

uniform float uNear;
uniform float uFar;
uniform vec3 uNearColor;
uniform vec3 uFarColor;

void main () {
  float interpolatedDistance = smoothstep(0., uFar, distToCamera);
  vec3 col = mix(uNearColor, uFarColor, interpolatedDistance);
  gl_FragColor = vec4(col, 1.);

  #include <colorspace_fragment>
}
