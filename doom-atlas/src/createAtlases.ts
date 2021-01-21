import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { createTextureAtlas, createFlatAtlas } from '.'
import { AtlasSet } from './AtlasSet'
import { createSpriteAtlas } from './createSpriteAtlas'

export const createAtlases = (wad: Wad): AtlasSet => ({
    textureAtlas: createTextureAtlas(wad, 2048),
    flatAtlas: createFlatAtlas(wad, 1024),
    spriteAtlas: createSpriteAtlas(wad, 2048)
})
