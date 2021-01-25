export const bindTexture = (gl: WebGL2RenderingContext, texture: WebGLTexture): void => {
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
}
