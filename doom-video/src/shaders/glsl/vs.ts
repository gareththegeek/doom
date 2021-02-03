export default `
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aAtlasCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;
varying highp vec4 vAtlasCoord;
varying highp float depth;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vTextureCoord = aTextureCoord;
  vAtlasCoord = aAtlasCoord;
  depth = gl_Position.z;
}
`
