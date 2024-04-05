precision mediump float;

varying vec2 vUv;
uniform sampler2D uMap;

#define M_PI 3.1415926535897932384626433832795

float rand2 (vec2 st) {
  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
}

float rand1 (float s) {
  return fract(sin(s) * 43758.5453123);
}

float randomWithSeed (vec2 uv, float seed) {
  return fract(sin(dot(uv, vec2(seed, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
  return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
  );
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

vec4 permute(vec4 x)
{
  return mod(((x*34.0)+1.0)*x, 289.0);
}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
  float x = vUv.x;
  float y = vUv.y;

  // 7
  // float strength = mod(uv.y * 10.0, 1.0);

  // 8
  // float strength = step(0.5, mod(uv.y * 10.0, 1.0));

  // 11
  // float strength = step(0.8, mod(uv.y * 10.0, 1.0)) + step(0.8, mod(uv.x * 10.0, 1.0));

  // 12
  // float strength = 1.0
  //     - step(0.3, mod(uv.x * 10.0, 1.0))
  //     - step(0.3, mod(uv.y * 10.0, 1.0));

  // 12.1
  // float strength =
  //     step(0.3, mod(uv.x * 10.0, 1.0)) - step(0.6, mod(uv.x * 10.0, 1.0))
  //     + step(0.3, mod(uv.y * 10.0, 1.0)) - step(0.6, mod(uv.y * 10.0, 1.0))
  //     - 1.0;

  // Random
  // float strength = rand2(vUv);
  
  // 1D Noise
  // float i = floor(x * 10.0);
  // float f = fract(x * 10.0);
  // float strength = rand1(i); // No interpolation
  // float strength = mix(rand1(i), rand1(i + 1.0), f); // Linear interpolation
  // float strength = mix(rand1(i), rand1(i + 1.0), smoothstep(0.,1.,f)); // Smooth interpolation

  // 13
  // float strength = 1.0
  //   - step(0.6, mod(vUv.x * 10.0, 1.0))
  //   - step(0.2, mod(vUv.y * 10.0, 1.0));

  // 14
  // float strength = 1.0
  //   - step(0.6, mod(vUv.x * 10.0, 1.0))
  //   - step(0.6, mod(vUv.y * 10.0, 1.0))
  //   - (step(0.3, mod(vUv.x * 10.0, 1.0)) * step(0.3, mod(vUv.y * 10.0, 1.0)));

  // 15
  // float horizontal = 1.0
  //   - step(0.8, mod(vUv.x * 10.0, 1.0)) - (1.0 - step(0.2, mod(vUv.x * 10.0, 1.0)))
  //   - step(0.6, mod(vUv.y * 10.0, 1.0)) - (1.0 - step(0.4, mod(vUv.y * 10.0, 1.0)));
  // float vertical = 1.0
  //   - step(0.6, mod(vUv.x * 10.0, 1.0)) - (1.0 - step(0.4, mod(vUv.x * 10.0, 1.0)))
  //   - step(0.8, mod(vUv.y * 10.0, 1.0)) - (1.0 - step(0.2, mod(vUv.y * 10.0, 1.0)));;
  // float strength = horizontal + vertical;

  // 16
  // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

  // 19
  // float strength = max(
  //   1.0 - step(0.3, vUv.x) + step(0.7, vUv.x),
  //   1.0 - step(0.3, vUv.y) + step(0.7, vUv.y)
  // );

  // 20
  // float square1 = max(
  //   1.0 - step(0.3, vUv.x) + step(0.7, vUv.x),
  //   1.0 - step(0.3, vUv.y) + step(0.7, vUv.y)
  // );
  // float square2 = 1.0 - max(
  //   1.0 - step(0.2, vUv.x) + step(0.8, vUv.x),
  //   1.0 - step(0.2, vUv.y) + step(0.8, vUv.y)
  // );
  // float strength = square1 * square2;

  // 21
  // float strength = floor(x * 10.0) / 10.0;

  // 22
  // float strength = (floor(x * 10.0) / 10.0) *  (floor(y * 10.0) / 10.0);

  // 23
  // float strength = rand2(vUv);

  // 24
  // float strength = rand2(floor(vUv * 10.0) / 10.0);

  // 24.1
  // vec2 gridUv = vec2(
  //   floor(x * 10.0) / 10.0,
  //   floor(y * 10.0) / 10.0
  // );
  // float strength = rand2(gridUv);


  // 24.2
  // float strength = rand2(floor(vUv * 10.0) / 10.0);

  // vec2 i = floor(vUv * 10.0);
  // vec2 f = fract(vUv * 10.0);

  // float strength = mix(vec2(0.1), vec2(0.9), x);
  
  // float strength = rand2(i); // No interpolation
  // float strength = mix(rand2(i), rand2(i + vec2(1.0)), f.x); // Linear interpolation
  // float strength = mix(rand2(i), rand2(i + 1.0), smoothstep(0.,1.,f)); // Smooth interpolation

  // 26
  // float strength = length(vUv);

  // 27
  // float strength = length(vUv - vec2(0.5, 0.5));

  // 28
  // float strength = 1.0 - distance(vUv, vec2(0.5, 0.5));

  // 29
  // float strength = 0.02 / distance(vUv, vec2(0.5, 0.5));

  // 30
  // float strength = 0.02 / distance(vec2(x / 8.0, y), vec2(0.5 / 8.0, 0.5));

  // 31
  // float stretch = 6.0;
  // float strength = (0.02 / distance(vec2(x / stretch, y), vec2(0.5 / stretch, 0.5)))
  //   * (0.02 / distance(vec2(x, y / stretch), vec2(0.5, 0.5 / stretch)));

  // 32
  // vec2 rotatedUv = rotate(vUv, M_PI / 4.0, vec2(0.5, 0.5));
  // float stretch = 6.0;
  // float strength = (0.02 / distance(vec2(rotatedUv.x / stretch, rotatedUv.y), vec2(0.5 / stretch, 0.5)))
  //   * (0.02 / distance(vec2(rotatedUv.x, rotatedUv.y / stretch), vec2(0.5, 0.5 / stretch)));

  // 33
  // float strength = step(0.3, distance(vUv, vec2(0.5, 0.5)));

  // 34
  // float strength = abs(distance(vUv, vec2(0.5, 0.5)) - 0.25);

  // 35
  // float strength = step(0.3, distance(vUv, vec2(0.5, 0.5))) + (1.0 - step(0.25, distance(vUv, vec2(0.5, 0.5))));

  // 36
  // float strength = step(0.25, distance(vUv, vec2(0.5, 0.5))) - step(0.3, distance(vUv, vec2(0.5, 0.5)));

  // 37
  // vec2 customUv = vec2(vUv.x, vUv.y + sin(x * 30.0) * 0.1);
  // float strength = step(0.25, distance(customUv, vec2(0.5, 0.5))) - step(0.3, distance(customUv, vec2(0.5, 0.5)));

  // 38
  // vec2 customUv = vec2(vUv.x + cos(y * 20.0) * 0.15, vUv.y + sin(x * 30.0) * 0.1);
  // float strength = step(0.25, distance(customUv, vec2(0.5, 0.5))) - step(0.3, distance(customUv, vec2(0.5, 0.5)));

  // 39
  // vec2 customUv = vec2(vUv.x + cos(y * 80.0) * 0.10, vUv.y + sin(x * 80.0) * 0.1);
  // float strength = step(0.25, distance(customUv, vec2(0.5, 0.5))) - step(0.3, distance(customUv, vec2(0.5, 0.5)));

  // 40
  // float strength = atan(x, y);

  // 41
  // vec2 movedUv = vUv - 0.5;
  // float strength = atan(movedUv.x, movedUv.y);

  // 42
  // float angle = atan(x - 0.5, y - 0.5);
  // angle += M_PI;
  // angle /= M_PI * 2.0;
  // float strength = angle;

  // 43
  // float angle = mod((atan(x - 0.5, y - 0.5) + M_PI) / (2.0 * M_PI) * 20.0, 1.0);
  // float strength = angle;

  // 44
  // float angle = atan(x - 0.5, y - 0.5);
  // angle += M_PI;
  // angle /= M_PI * 2.0;
  // angle = (angle + M_PI) / (2.0 * M_PI);
  // angle = mod(angle * 20.0, 5.0);
  // float strength = sin(angle);
  // float strength = sin(angle * 100.0);

  // 45
  // float angle = atan(x - 0.5, y - 0.5);
  // angle += M_PI;
  // angle /= M_PI * 2.0;
  // angle *= 100.0;
  // vec2 customUv = vec2(vUv.x + cos(angle) * 0.02, vUv.y + sin(angle) * 0.02);
  // float strength = step(0.275, distance(customUv, vec2(0.5, 0.5))) - step(0.3, distance(customUv, vec2(0.5, 0.5)));


  // 46 - Value Noise
  // vec2 i = floor(vUv * 50.0);
  // vec2 f = fract(vUv * 50.0);

  // float a = rand2(i);
  // float b = rand2(i + vec2(1.0, 0.0));
  // float c = rand2(i + vec2(0.0, 1.0));
  // float d = rand2(i + vec2(1.0, 1.0));

  // vec2 u = smoothstep(0.,1.,f);
  // float strength = mix(a, b, u.x) +
  //   (c - a) * u.y * (1.0 - u.x) +
  //   (d - b) * u.x * u.y;

  // 47 - Perlin Noise
  // float strength = cnoise(vUv * 10.0);

  // 47.1 - Rorschach inkblot
  // vec2 modifiedUv = vec2(0.5 - abs(vUv.x - 0.5), vUv.y);
  // float strength = 1. - step(0.2, cnoise(modifiedUv * 5.0) * 2.0 + cnoise(modifiedUv * 20.0) + cnoise(modifiedUv * 70.0) * 0.15);

  // 48
  // float strength = 1. - abs(cnoise(vUv * 10.0));

  // 49
  float strength = sin(cnoise(vUv * 10.0) * 100.0);

    
  gl_FragColor = vec4(strength, strength, strength, 1.0);



  // gl_FragColor = vec4(randomWithSeed(vUv, 12.9898), randomWithSeed(vUv, 13.9898), randomWithSeed(vUv, 14.9898), 1.0);
}
