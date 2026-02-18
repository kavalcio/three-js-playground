varying float distToCamera;

void main () {
  gl_FragColor = vec4(vec3(1. / distToCamera), 1.);
}
