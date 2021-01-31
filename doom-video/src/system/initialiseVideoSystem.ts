import { WadColorMap } from 'doom-wad/dist/interfaces/WadColorMapLump'
import { WadColour } from 'doom-wad/dist/interfaces/WadPlayPalLump'
import { createResources } from './createResources'
import { V } from './global'

export const initialiseVideoSystem = (
    gl: WebGL2RenderingContext,
    texture: number[],
    textureSize: number,
    palette: WadColour[],
    colormaps: WadColorMap[]
): void => {
    V.gl = gl
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clearDepth(1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.enable(gl.CULL_FACE)
    gl.cullFace(gl.BACK)
    gl.frontFace(gl.CW)
    console.log('Set gl context')
    V.resources = createResources(texture, textureSize, palette, colormaps)
    console.log('Set resources')
}
