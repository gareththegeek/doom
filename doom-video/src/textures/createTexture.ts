import { WadColorMap } from 'doom-wad/dist/interfaces/WadColorMapLump'
import { WadColour } from 'doom-wad/dist/interfaces/WadPlayPalLump'
import { V } from '../system/global'

const createTextureInternal = (
    width: number,
    height: number,
    pixels: ArrayBufferView,
    internalFormat: number,
    srcFormat: number
): WebGLTexture => {
    const { gl } = V
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

export const createPalette = (pixels: WadColour[]): WebGLTexture => {
    const { gl } = V
    const image = new Uint8Array(pixels.flat())
    return createTextureInternal(pixels.length, 1, image, gl.RGB8, gl.RGB)
}

export const createColourMap = (maps: WadColorMap[]): WebGLTexture => {
    const { gl } = V
    const image = new Uint8Array(maps.flatMap((map) => map.indices))
    return createTextureInternal(maps[0].indices.length, maps.length, image, gl.ALPHA, gl.ALPHA)
}

export const createIndexedTexture = (pixels: number[], size: number): WebGLTexture => {
    const { gl } = V
    const image = new Uint8Array(pixels)
    return createTextureInternal(size, size, image, gl.RG8, gl.RG)
}
