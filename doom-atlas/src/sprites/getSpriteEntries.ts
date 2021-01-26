import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { WadPictureLump } from 'doom-wad/dist/interfaces/WadPictureLump'
import { AtlasEntry } from '../interfaces/AtlasEntry'
import { blitPatch } from '../textures'

export const getSpriteEntries = (image: number[], size: number, wad: Wad): AtlasEntry<WadPictureLump>[] =>
    Object.entries(wad.sprites).map(([name, sprite]) => ({
        width: sprite.width,
        height: sprite.height,
        name,
        data: sprite,
        blit: (sprite: AtlasEntry<WadPictureLump>, x: number, y: number) => blitPatch(image, size, sprite.data, x, y)
    }))
