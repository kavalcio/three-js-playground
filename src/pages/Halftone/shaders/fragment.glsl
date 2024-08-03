uniform vec3 uModelColor;
uniform vec2 uResolution;

varying vec3 vNormal;
varying vec3 vModelPosition;

#include ../../../shaders/lighting/ambientLight.glsl
#include ../../../shaders/lighting/directionalLight.glsl

float blendLinearBurn(float base, float blend) {
	// Note : Same implementation as BlendSubtractf
	return max(base+blend-1.0,0.0);
}

vec3 blendLinearBurn(vec3 base, vec3 blend) {
	// Note : Same implementation as BlendSubtract
	return max(base+blend-vec3(1.0),vec3(0.0));
}

vec3 blendLinearBurn(vec3 base, vec3 blend, float opacity) {
	return (blendLinearBurn(base, blend) * opacity + base * (1.0 - opacity));
}

float blendLinearDodge(float base, float blend) {
	// Note : Same implementation as BlendAddf
	return min(base+blend,1.0);
}

vec3 blendLinearDodge(vec3 base, vec3 blend) {
	// Note : Same implementation as BlendAdd
	return min(base+blend,vec3(1.0));
}

vec3 blendLinearDodge(vec3 base, vec3 blend, float opacity) {
	return (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));
}

float blendLinearLight(float base, float blend) {
	return blend<0.5?blendLinearBurn(base,(2.0*blend)):blendLinearDodge(base,(2.0*(blend-0.5)));
}

vec3 blendLinearLight(vec3 base, vec3 blend) {
	return vec3(blendLinearLight(base.r,blend.r),blendLinearLight(base.g,blend.g),blendLinearLight(base.b,blend.b));
}

vec3 blendLinearLight(vec3 base, vec3 blend, float opacity) {
	return (blendLinearLight(base, blend) * opacity + base * (1.0 - opacity));
}

void main()
{
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(vModelPosition - cameraPosition);

  vec3 light = vec3(0.);

  vec3 color = uModelColor;

  // Ambient light
  light += ambientLight(
    vec3(1.),
    0.2
  );

  // Directional light
  light += directionalLight(
    vec3(1.),           // Light position
    viewDirection,                  // View direction
    normal,                         // Normal
    vec3(1.),              // Light color
    1.3,   // Diffuse Light intensity
    1.2,  // Specular Light intensity
    15.       // Specular power
  );

  color *= light;

  // Halftone
  float repetitions = 70.;
  vec2 uv = gl_FragCoord.xy / uResolution.y;
  uv = mod(uv * repetitions, 1.);

  float circlePattern = (1. - distance(vec2(0.5), uv));

  float brightness = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b);
  float blendedBrightness = blendLinearLight(circlePattern, brightness);
  float halftone = step(0.2, blendedBrightness);

  // Final color
  gl_FragColor = vec4(vec3(halftone), 1.0);

  // gl_FragColor = mix(vec4(color, 1.0), vec4(1.0, 0., 0., 1.), final);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
