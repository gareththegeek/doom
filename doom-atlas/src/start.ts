import * as path from 'path'
import { read } from 'doom-wad'
import { writeAtlas } from './writeAtlas'
;import { createAtlas } from './createAtlas'
(async () => {
    try {
        const wad = await read(path.join(__dirname, '../data/doom2.wad'))
        if (!wad) {
            throw new Error('Unable to load doom.wad')
        }
        const atlas = createAtlas(wad, 4096)
        await writeAtlas(wad, atlas, path.join(__dirname, '../out/atlas.png'))
    } catch (e) {
        console.error(e.message)
    }
})()
