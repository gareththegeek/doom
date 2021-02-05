export default `
#define PI 3.1415926535897932384626433832795

attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aAtlasCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;
varying highp vec4 vAtlasCoord;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  highp float rotation = acos(uModelViewMatrix[0][0]);
  highp float offset = rotation / (2.0 * PI);
  vTextureCoord = aTextureCoord; //vec2(aTextureCoord.x+offset, aTextureCoord.y);
  vAtlasCoord = aAtlasCoord;
}
`
