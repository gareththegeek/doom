export default `
varying highp vec2 vTextureCoord;
varying highp vec4 vAtlasCoord;
varying highp float vDepth;
varying highp float vSky;

uniform highp float uLightLevel;
uniform highp vec2 uResolution;
uniform highp float uSkyRotation;
uniform sampler2D uSamplerAtlas;
uniform sampler2D uSamplerPalette;
uniform sampler2D uSamplerColourMap;

const highp float MIN_LIGHT = 32.0 / 34.0;
const highp float ONE_LIGHT_LEVEL = 1.0 / 34.0;
const highp float HALF_LIGHT_LEVEL = ONE_LIGHT_LEVEL / 2.0;
const highp float MAX_DIMINISH = 12.0 * ONE_LIGHT_LEVEL;

void main(void) {
   highp vec2 landCoord = fract(vTextureCoord);
   highp vec2 skyCoord = gl_FragCoord.xy / uResolution;
   highp vec2 invertSkyCoord = vec2(fract(skyCoord.x + uSkyRotation), 1.0 - skyCoord.y);
   highp vec2 textureCoord = mix(landCoord, invertSkyCoord, vSky);
   highp vec2 sampleCoords = mix(vec2(vAtlasCoord.rg), vec2(vAtlasCoord.ba), textureCoord);
   highp vec2 cmindex = texture2D(uSamplerAtlas, sampleCoords.yx).rg;
   if(cmindex.g < 0.5)
      discard;
   highp float diminish = clamp((floor(vDepth / 20.0) - 16.0) * ONE_LIGHT_LEVEL, -MAX_DIMINISH, MAX_DIMINISH);
   highp float light = (uLightLevel + diminish) * (1.0 - vSky);
   highp float final_light = clamp(light, 0.0, MIN_LIGHT);
   highp float index = texture2D(uSamplerColourMap, vec2(cmindex.r, final_light)).r;
   highp vec3 colour = texture2D(uSamplerPalette, vec2(index, 0.5)).rgb;
   gl_FragColor = vec4(colour, 1.0);
}
`
