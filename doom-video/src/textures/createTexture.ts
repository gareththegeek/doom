import { IndexedPixel } from 'doom-wad/dist/interfaces/WadPictureLump'
import { WadColour } from 'doom-wad/dist/interfaces/WadPlayPalLump'

const createTextureInternal = (
    gl: WebGL2RenderingContext,
    width: number,
    height: number,
    pixels: ArrayBufferView
): WebGLTexture => {
    const texture = gl.createTexture()
    if (!texture) {
        throw new Error('Unable to create texture')
    }
    gl.bindTexture(gl.TEXTURE_2D, texture)

    const level = 0
    const internalFormat = gl.RGBA
    const srcFormat = gl.RGBA
    const srcType = gl.UNSIGNED_BYTE

    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, 0, srcFormat, srcType, pixels)
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    return texture
}

export const createPalette = (gl: WebGL2RenderingContext, pixels: WadColour[]): WebGLTexture => {
    const image = new Uint8Array(pixels.map((pixel) => [...pixel, 255]).flat())
    return createTextureInternal(gl, pixels.length, 1, image)
}

export const createIndexedTexture = (gl: WebGL2RenderingContext, pixels: IndexedPixel[][]): WebGLTexture => {
    const image = new Uint8Array(
        pixels
            .flat()
            .map((pixel) => (pixel === undefined ? [0, 0, 0, 0] : [pixel, pixel, pixel, 255]))
            .flat()
    )
    return createTextureInternal(gl, pixels.length, pixels[0].length, image)
}
