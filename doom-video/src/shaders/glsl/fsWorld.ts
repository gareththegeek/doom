export default `
#define PI 3.1415926535897932384626433832795

precision mediump float;

varying vec2 vTextureCoord;
varying vec4 vAtlasCoord;
varying float vDepth;
varying float vSky;

uniform float uLightLevel;
uniform vec2 uResolution;
uniform vec2 uFov;
uniform float uSkyRotation;
uniform sampler2D uSamplerAtlas;
uniform sampler2D uSamplerPalette;
uniform sampler2D uSamplerColourMap;

const float MIN_LIGHT = 31.0 / 33.0;
const float ONE_LIGHT_LEVEL = 1.0 / 33.0;
const float HALF_LIGHT_LEVEL = ONE_LIGHT_LEVEL / 2.0;
const float MAX_DIMINISH = 12.0 * ONE_LIGHT_LEVEL;

const float SKY_REPEAT = 8.0;
const float TWO_PI = PI * 2.0;

void main(void) {
   // Wall and flat texture coordinates
   vec2 landCoord = fract(vTextureCoord);
   
   // Sky texture coordinates
   vec2 skyCoord = gl_FragCoord.xy / uResolution;
   float hfov = uFov.x / TWO_PI;
   vec2 invertSkyCoord = vec2(fract((skyCoord.x * hfov + uSkyRotation) * SKY_REPEAT), 1.0 - skyCoord.y);
   
   // Use texture coordinate to get colour index from texture atlas
   vec2 textureCoord = mix(landCoord, invertSkyCoord, vSky);
   vec2 sampleCoords = mix(vec2(vAtlasCoord.rg), vec2(vAtlasCoord.ba), textureCoord);
   vec2 cmindex = texture2D(uSamplerAtlas, sampleCoords.yx).rg;
   
   // Alpha mask
   if(cmindex.g < 0.5)
      discard;
   
   // Apply lighting using colourmap and diminishing lighting
   float diminish = clamp(floor(vDepth / 100.0) * ONE_LIGHT_LEVEL, 0.0, 8.0);
   float light = (uLightLevel + diminish) * (1.0 - vSky);
   float final_light = clamp(light, 0.0, MIN_LIGHT);

   // Get the colour from the palette
   float index = texture2D(uSamplerColourMap, vec2(cmindex.r, final_light)).r;
   vec3 colour = texture2D(uSamplerPalette, vec2(index, 0.5)).rgb;
   gl_FragColor = vec4(colour, 1.0);
}
`
