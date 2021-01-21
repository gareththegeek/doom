import { IndexedPixel } from 'doom-wad/dist/interfaces/WadPictureLump'

export interface TextureAtlasEntry {
    left: number
    right: number
    top: number
    bottom: number
}

export interface TextureAtlas {
    image: IndexedPixel[][]
    lookup: { [name: string]: TextureAtlasEntry }
}
