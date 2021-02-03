import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { WadLookup } from 'doom-wad/dist/interfaces/Wad'
import { WadPictureLump } from 'doom-wad/dist/interfaces/WadPictureLump'
import { createSpriteSheet } from './createSpriteSheet'
import { SpriteSheetLookup } from './interfaces/SpriteSheetLookup'

export const createSpriteLookup = (sprites: WadLookup<WadPictureLump>, atlas: TextureAtlas): SpriteSheetLookup => {
    const names = [...new Set(Object.keys(sprites).map((name) => name.substr(0, 4)))].sort()
    const result: SpriteSheetLookup = {}
    names.forEach((name) => {
        result[name] = createSpriteSheet(atlas, name)
    })

    return result
}
