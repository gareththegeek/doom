export default `
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aAtlasCoord;
attribute highp float aSky;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;
varying highp vec4 vAtlasCoord;
varying highp float vDepth;
varying highp float vSky;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vTextureCoord = aTextureCoord;
  vAtlasCoord = aAtlasCoord;
  vDepth = gl_Position.z;
  vSky = aSky;
}
`
