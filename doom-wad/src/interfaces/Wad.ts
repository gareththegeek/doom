import { WadColorMapLump } from './WadColorMapLump'
import { WadPictureLump } from './WadPictureLump'
import { WadPlayPalLump } from './WadPlayPalLump'
import { WadPNamesLump } from './WadPNamesLump'
import { WadTextureLump } from './WadTextureLump'

export type WadPictureLookup = { [name: string]: WadPictureLump }
export type WadFlatLookup = { [name: string]: WadFlatLump }

export interface Wad {
    playpal: WadPlayPalLump
    colormap: WadColorMapLump
    pnames: WadPNamesLump
    texture1: WadTextureLump
    texture2?: WadTextureLump
    patches: WadPictureLookup
    flats: WadFlatLookup
    sprites: WadPictureLookup
}
