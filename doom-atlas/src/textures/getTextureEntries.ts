import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { WadMapTexture } from 'doom-wad/dist/interfaces/WadTextureLump'
import { AtlasEntry } from '../interfaces/AtlasEntry'
import { blitTexture } from './blitTexture'

export const getTextureEntries = (image: number[], size: number, wad: Wad): AtlasEntry<WadMapTexture>[] => {
    let allTextures = wad.texture1.maptextures
    if (!!wad.texture2) {
        allTextures = allTextures.concat(wad.texture2.maptextures)
    }

    const blit = (texture: AtlasEntry<WadMapTexture>, x: number, y: number): void => {
        blitTexture(wad, image, size, texture.data, x, y)
    }

    return allTextures.map((texture) => ({
        width: texture.width,
        height: texture.height,
        name: texture.name,
        data: texture,
        blit
    }))
}
