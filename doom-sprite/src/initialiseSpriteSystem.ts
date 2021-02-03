import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { WadLookup } from 'doom-wad/dist/interfaces/Wad'
import { WadPictureLump } from 'doom-wad/dist/interfaces/WadPictureLump'
import { createSpriteLookup } from './createSpriteLookup'
import { S } from './global'

export const initialiseSpriteSystem = (sprites: WadLookup<WadPictureLump>, atlas: TextureAtlas) => {
    S.lookup = createSpriteLookup(sprites, atlas)
}
