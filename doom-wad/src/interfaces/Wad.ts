import { WadColorMapLump } from './WadColorMapLump'
import { WadPlayPalLump } from './WadPlayPalLump'

export interface Wad {
    playpal: WadPlayPalLump
    colormap: WadColorMapLump
}
