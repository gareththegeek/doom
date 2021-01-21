import * as path from 'path'
import { read } from 'doom-wad'
import { writeAtlas } from './writeAtlas'
;import { createAtlases } from './createAtlases'
(async () => {
    try {
        const wad = await read(path.join(__dirname, '../data/doom.wad'))
        if (!wad) {
            throw new Error('Unable to load doom.wad')
        }
        const atlases = createAtlases(wad)
        await writeAtlas(wad, atlases.textureAtlas, path.join(__dirname, '../out/textures.png'))
        await writeAtlas(wad, atlases.flatAtlas, path.join(__dirname, '../out/flats.png'))
        await writeAtlas(wad, atlases.spriteAtlas, path.join(__dirname, '../out/sprites.png'))
    } catch (e) {
        console.error(e.message)
    }
})()
