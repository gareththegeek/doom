import { read } from 'doom-wad'
import * as path from 'path'
;(async () => {
    try {
        const wad = await read(path.join(__dirname, '../data/doom.wad'))
        if (!wad) {
            throw new Error('Unable to load doom.wad')
        }

    } catch (e) {
        console.error(e.message)
    }
})()
