export const bindTexture = (gl: WebGLRenderingContext, texture: WebGLTexture): void => {
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
}
