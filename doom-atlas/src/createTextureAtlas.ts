import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { WadMapTexture } from 'doom-wad/dist/interfaces/WadTextureLump'
import { allocateImage } from './allocateImage'
import { AtlasEntry } from './AtlasEntry'
import { blitTexture } from './blitTexture'
import { packEntries } from './packEntries'
import { TextureAtlas } from './TextureAtlas'

export const createTextureAtlas = (wad: Wad, size: number): TextureAtlas => {
    const image = allocateImage(size)
    const blit = (texture: AtlasEntry<WadMapTexture>, x: number, y: number): void => {
        blitTexture(wad, image, texture.data, x, y)
    }
    
    let allTextures = wad.texture1.maptextures
    if (!!wad.texture2) {
        allTextures = allTextures.concat(wad.texture2.maptextures)
    }

    const entries = allTextures.map((texture) => ({
        width: texture.width,
        height: texture.height,
        name: texture.name,
        data: texture
    }))

    return {
        image,
        lookup: packEntries(size, entries, blit)
    }
}
