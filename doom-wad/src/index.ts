import { read } from './read'
import * as path from 'path'
import { writePlayPalLump } from './palettes'
;(async () => {
    const wad = await read(path.join(__dirname, '../data/doom.wad'))
    await writePlayPalLump(path.join(__dirname, '../out/palettes/'), wad!.playpal)
})()

export { read }
