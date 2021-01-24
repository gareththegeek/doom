import { IndexedPixel } from 'doom-wad/dist/interfaces/WadPictureLump'

export interface TextureAtlasEntry {
    left: number
    right: number
    top: number
    bottom: number
    pixelWidth: number
    pixelHeight: number
}

export type TextureAtlasLookup = { [name: string]: TextureAtlasEntry }

export interface TextureAtlas {
    image: IndexedPixel[][]
    lookup: TextureAtlasLookup
}
