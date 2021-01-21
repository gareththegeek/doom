import * as path from 'path'
import { read } from 'doom-wad'
import { createAtlas } from './createAtlas'
import { writeAtlas } from './writeAtlas'
;(async () => {
    try {
        const wad = await read(path.join(__dirname, '../data/doom.wad'))
        if (!wad) {
            throw new Error('Unable to load doom.wad')
        }
        const atlas = createAtlas(wad, 2048)
        await writeAtlas(wad, atlas, path.join(__dirname, '../out/atlas.png'))
        console.log(atlas.lookup)
    } catch (e) {
        console.error(e.message)
    }
})()
