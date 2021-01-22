import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { WadPictureLump } from 'doom-wad/dist/interfaces/WadPictureLump'
import { allocateImage } from './allocateImage'
import { AtlasEntry } from './AtlasEntry'
import { blitPatch } from './blitTexture'
import { packEntries } from './packEntries'
import { TextureAtlas, } from './TextureAtlas'

export const createSpriteAtlas = (wad: Wad, size: number): TextureAtlas => {
    const image = allocateImage(size)
    const blit = (sprite: AtlasEntry<WadPictureLump>, x: number, y: number) => {
        blitPatch(image, sprite.data, x, y)
    }

    const entries = Object.entries(wad.sprites).map(([name, sprite]) => ({
        width: sprite.width,
        height: sprite.height,
        name,
        data: sprite
    }))

    return {
        image,
        lookup: packEntries(size, entries, blit)
    }
}
