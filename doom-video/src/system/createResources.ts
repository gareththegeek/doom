import { WadColorMap } from 'doom-wad/dist/interfaces/WadColorMapLump'
import { WadColour } from 'doom-wad/dist/interfaces/WadPlayPalLump'
import { VideoResources } from '../interfaces/VideoResources'
import { createShaderProgram } from '../shaders'
import { createIndexedTexture, createPalette, createColourMap } from '../textures'

export const createResources = (
    texture: number[],
    textureSize: number,
    palette: WadColour[],
    colormaps: WadColorMap[]
): VideoResources => ({
    texture: createIndexedTexture(texture, textureSize),
    palette: createPalette(palette),
    colourmaps: createColourMap(colormaps),
    program: createShaderProgram()
})
