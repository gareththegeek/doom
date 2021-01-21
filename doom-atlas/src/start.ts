import * as path from 'path'
import { read } from 'doom-wad'
import { createTextureAtlas } from './createTextureAtlas'
import { writeAtlas } from './writeAtlas'
import { createFlatAtlas } from '.'
;(async () => {
    try {
        const wad = await read(path.join(__dirname, '../data/doom.wad'))
        if (!wad) {
            throw new Error('Unable to load doom.wad')
        }
        const atlas1 = createTextureAtlas(wad, 2048)
        const atlas2 = createFlatAtlas(wad, 1024)
        await writeAtlas(wad, atlas1, path.join(__dirname, '../out/atlas1.png'))
        await writeAtlas(wad, atlas2, path.join(__dirname, '../out/atlas2.png'))
    } catch (e) {
        console.error(e.message)
    }
})()
