import { WadColorMapLump } from './WadColorMapLump'
import { WadFlatLump } from './WadFlatLump'
import { WadLump } from './WadLump'
import { WadMapLump } from './WadMapLump'
import { WadPictureLump } from './WadPictureLump'
import { WadPlayPalLump } from './WadPlayPalLump'
import { WadPNamesLump } from './WadPNamesLump'
import { WadTextureLump } from './WadTextureLump'

export type WadLookup<T extends WadLump> = { [name: string]: T}

export interface Wad {
    playpal: WadPlayPalLump
    colormap: WadColorMapLump
    pnames: WadPNamesLump
    texture1: WadTextureLump
    texture2?: WadTextureLump
    patches: WadLookup<WadPictureLump>
    flats: WadLookup<WadFlatLump>
    sprites: WadLookup<WadPictureLump>
    maps: WadLookup<WadMapLump>
}
