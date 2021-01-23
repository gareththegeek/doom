import { WadLump } from './WadLump'

export interface WadSideDef {
    xoffset: number
    yoffset: number
    upperTexture: string
    lowerTexture: string
    middleTexture: string
    sector: number
}
