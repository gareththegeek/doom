import { WadColorMapLump } from './WadColorMapLump'
import { WadPlayPalLump } from './WadPlayPalLump'
import { WadPNamesLump } from './WadPNamesLump'
import { WadTextureLump } from './WadTextureLump'

export interface Wad {
    playpal: WadPlayPalLump
    colormap: WadColorMapLump
    pnames: WadPNamesLump
    texture1: WadTextureLump
    texture2?: WadTextureLump
}
