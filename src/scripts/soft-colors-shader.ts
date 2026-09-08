// Wave rendering and OKLab blending from Théo’s Soft Colors project.
export const vertexSource = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

export const fragmentSource = `
precision highp float;
varying vec2 vUv;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float mouseInfluence;
uniform vec3 waveColors[4];
uniform float frequency;
uniform float intensity;
uniform float orbitRadius;
uniform float grainAmount;
vec3 linearToSrgb(vec3 c) {
    c = max(c, 0.0);
    return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

vec3 oklabToLinear(vec3 lab) {
    vec3 lms = vec3(
        lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z,
        lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z,
        lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z
    );
    lms = lms * lms * lms;
    return vec3(
        dot(lms, vec3( 4.0767416621, -3.3077115913,  0.2309699292)),
        dot(lms, vec3(-1.2684380046,  2.6097574011, -0.3413193965)),
        dot(lms, vec3(-0.0041960863, -0.7034186147,  1.7076147010))
    );
}

// The one conversion that genuinely varies per pixel: the blended result on its
// way back out to the framebuffer.
vec3 fromBlend(vec3 lab) {
    return linearToSrgb(oklabToLinear(lab));
}

float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float wave(float phase) {
    return clamp(0.5 + sin(phase) * 0.5 * intensity, 0.0, 1.0);
}

vec3 sampleWaves(vec2 uv, float t) {
    float influence = clamp(mouseInfluence, 0.0, 0.9);

    float radiusScale1 = 0.25 * orbitRadius;
    float radiusScale2 = 0.3 * orbitRadius;
    float radiusScale3 = 0.2 * orbitRadius;

    vec2 autoOrigin1 = vec2(
        0.5 + cos(t * 0.5) * radiusScale1,
        0.5 + sin(t * 0.5) * radiusScale1);

    vec2 autoOrigin2 = vec2(
        0.5 + cos(t * 0.7 + 2.0) * radiusScale2,
        0.5 + sin(t * 0.3) * radiusScale2);

    vec2 autoOrigin3 = vec2(
        0.5 + cos(t * -0.4 + 4.0) * radiusScale3,
        0.5 + sin(t * 0.8 + 0.5) * radiusScale3);

    vec2 origin1 = mix(autoOrigin1, mouse, influence);
    vec2 origin2 = mix(autoOrigin2, vec2(1.0 - mouse.x, 1.0 - mouse.y), influence);
    vec2 origin3 = mix(autoOrigin3, vec2(mouse.y, 1.0 - mouse.x), influence);

    float dist1 = length(uv - origin1) * 2.0;
    float dist2 = length(uv - origin2) * 2.0;
    float dist3 = length(uv - origin3) * 2.0;

    float freqMult1 = 7.0 * frequency;
    float freqMult2 = 10.0 * frequency;
    float freqMult3 = 6.0 * frequency;

    float wave1_o1 = wave(dist1 * freqMult1 - t);
    float wave2_o1 = wave((uv.x - origin1.x) * 18.0 * frequency + t * 1.5);
    float wave3_o1 = wave((uv.y - origin1.y) * 12.5 * frequency - t * 0.5);
    float finalWave_o1 = (wave1_o1 * 0.5 + wave2_o1 * 0.3 + wave3_o1 * 0.2);

    float wave1_o2 = wave(dist2 * freqMult2 - t * 0.8);
    float wave2_o2 = wave((uv.x - origin2.x) * freqMult2 * 0.7 + t * 0.7);
    float wave3_o2 = wave((uv.y - origin2.y) * freqMult2 * 0.6 - t * 1.2);
    float finalWave_o2 = (wave1_o2 * 0.5 + wave2_o2 * 0.3 + wave3_o2 * 0.2);

    float wave1_o3 = wave(dist3 * freqMult3 + t * 0.6);
    float wave2_o3 = wave((uv.x - origin3.x) * freqMult3 * 0.5 - t * 1.1);
    float wave3_o3 = wave((uv.y - origin3.y) * freqMult3 * 0.6 + t * 0.9);
    float finalWave_o3 = (wave1_o3 * 0.4 + wave2_o3 * 0.4 + wave3_o3 * 0.2);

    vec3 mix1 = mix(waveColors[0], waveColors[1], finalWave_o1);
    vec3 mix2 = mix(waveColors[1], waveColors[2], finalWave_o2);
    vec3 mix3 = mix(waveColors[2], waveColors[3], finalWave_o3);
    vec3 mix4 = mix(waveColors[3], waveColors[0], finalWave_o1);

    vec3 evenPairs = mix(mix1, mix3, finalWave_o2);
    vec3 oddPairs = mix(mix2, mix4, finalWave_o3);
    return mix(evenPairs, oddPairs, finalWave_o1);
}


void main() {
  // Keep the portfolio text readable even at the darkest wave settings.
  vec3 linear = clamp(oklabToLinear(sampleWaves(vUv, time)), 0.0, 1.0);
  float luminance = dot(linear, vec3(0.2126, 0.7152, 0.0722));
  float lift = clamp((0.265 - luminance) / max(1.0 - luminance, 0.0001), 0.0, 1.0);
  vec3 color = linearToSrgb(mix(linear, vec3(1.0), lift));
  float staticGrain = hash21(vUv * resolution * 0.5) * 2.0 - 1.0;
  float movingGrain = hash21(vUv * resolution * 0.5 + fract(time) * 91.7) * 2.0 - 1.0;
  color += mix(staticGrain, movingGrain, 0.6) * grainAmount;
  color += (hash21(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;
