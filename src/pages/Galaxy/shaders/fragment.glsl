varying vec3 vColor;

void main() {
  float d = distance(gl_PointCoord, vec2(0.5, 0.5));
  float brightness = pow(1. - smoothstep(0.1, 0.6, d), 3.);

  gl_FragColor = vec4(vColor * brightness, 1.0);
}
