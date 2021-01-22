import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { IndexedPixel, WadPictureLump } from 'doom-wad/dist/interfaces/WadPictureLump'
import { AtlasEntry } from '../AtlasEntry'
import { blitPatch } from '../textures'

export const getSpriteEntries = (image: IndexedPixel[][], wad: Wad): AtlasEntry<WadPictureLump>[] =>
    Object.entries(wad.sprites).map(([name, sprite]) => ({
        width: sprite.width,
        height: sprite.height,
        name,
        data: sprite,
        blit: (sprite: AtlasEntry<WadPictureLump>, x: number, y: number) => blitPatch(image, sprite.data, x, y)
    }))
