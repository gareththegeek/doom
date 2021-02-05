export default `
#define PI 3.1415926535897932384626433832795

precision mediump float;

varying vec2 vTextureCoord;
varying vec4 vAtlasCoord;
varying float vDepth;
varying float vSky;

uniform float uLightLevel;
uniform vec2 uResolution;
uniform float uSkyRotation;
uniform sampler2D uSamplerAtlas;
uniform sampler2D uSamplerPalette;
uniform sampler2D uSamplerColourMap;

const float MIN_LIGHT = 32.0 / 34.0;
const float ONE_LIGHT_LEVEL = 1.0 / 34.0;
const float HALF_LIGHT_LEVEL = ONE_LIGHT_LEVEL / 2.0;
const float MAX_DIMINISH = 12.0 * ONE_LIGHT_LEVEL;

const float SKY_REPEAT = 8.0;

void main(void) {
   vec2 landCoord = fract(vTextureCoord);
   vec2 skyCoord = gl_FragCoord.xy / uResolution;
   float hfov = ((uResolution.x / uResolution.y) * 45.0) / 360.0;
   vec2 invertSkyCoord = vec2(fract((skyCoord.x * hfov + uSkyRotation) * SKY_REPEAT), 1.0 - skyCoord.y);
   vec2 textureCoord = mix(landCoord, invertSkyCoord, vSky);
   vec2 sampleCoords = mix(vec2(vAtlasCoord.rg), vec2(vAtlasCoord.ba), textureCoord);
   vec2 cmindex = texture2D(uSamplerAtlas, sampleCoords.yx).rg;
   if(cmindex.g < 0.5)
      discard;
   float diminish = clamp((floor(vDepth / 20.0) - 16.0) * ONE_LIGHT_LEVEL, -MAX_DIMINISH, MAX_DIMINISH);
   float light = (uLightLevel + diminish) * (1.0 - vSky);
   float final_light = clamp(light, 0.0, MIN_LIGHT);
   float index = texture2D(uSamplerColourMap, vec2(cmindex.r, final_light)).r;
   vec3 colour = texture2D(uSamplerPalette, vec2(index, 0.5)).rgb;
   gl_FragColor = vec4(colour, 1.0);
}
`
