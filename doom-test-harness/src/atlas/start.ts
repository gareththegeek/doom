import * as path from 'path'
import { readFile } from '../wad/readFile'
import { createAtlas } from 'doom-atlas/dist/atlas'
import { writeAtlas } from './writeAtlas'
;(async () => {
    try {
        const wad = await readFile(path.join(__dirname, '../../data/doom2.wad'))
        if (!wad) {
            throw new Error('Unable to load doom.wad')
        }
        const atlas = createAtlas(wad, 4096)
        await writeAtlas(wad, atlas, path.join(__dirname, '../../out/atlas.png'))
    } catch (e) {
        console.error(e.message)
    }
})()
