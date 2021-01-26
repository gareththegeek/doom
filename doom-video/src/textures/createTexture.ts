import { WadColorMap } from 'doom-wad/dist/interfaces/WadColorMapLump'
import { IndexedPixel } from 'doom-wad/dist/interfaces/WadPictureLump'
import { WadColour } from 'doom-wad/dist/interfaces/WadPlayPalLump'

const createTextureInternal = (
    gl: WebGL2RenderingContext,
    width: number,
    height: number,
    pixels: ArrayBufferView,
    internalFormat: number,
    srcFormat: number
): WebGLTexture => {
    const texture = gl.createTexture()
    if (!texture) {
        throw new Error('Unable to create texture')
    }
    gl.bindTexture(gl.TEXTURE_2D, texture)

    const level = 0
    const srcType = gl.UNSIGNED_BYTE
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, 0, srcFormat, srcType, pixels)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    return texture
}

export const createPalette = (gl: WebGL2RenderingContext, pixels: WadColour[]): WebGLTexture => {
    const image = new Uint8Array(pixels.flat())
    return createTextureInternal(gl, pixels.length, 1, image, gl.RGB8, gl.RGB)
}

export const createColourMap = (gl: WebGL2RenderingContext, maps: WadColorMap[]): WebGLTexture => {
    const image = new Uint8Array(maps.flatMap((map) => map.indices))
    return createTextureInternal(gl, maps[0].indices.length, maps.length, image, gl.ALPHA, gl.ALPHA)
}

export const createIndexedTexture = (gl: WebGL2RenderingContext, pixels: number[], size: number): WebGLTexture => {
    const image = new Uint8Array(pixels)
    return createTextureInternal(gl, size, size, image, gl.RG8, gl.RG)
}
