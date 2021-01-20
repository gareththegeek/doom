import { read } from './read'
import * as path from 'path'
import { writeColorMapLump, writePlayPalLump } from './palettes'
;(async () => {
    const wad = await read(path.join(__dirname, '../data/doom.wad'))
    await writePlayPalLump(path.join(__dirname, '../out/palettes/'), wad!.playpal)
    await writeColorMapLump(
        path.join(__dirname, '../out/palettes/colormap.png'),
        wad!.colormap,
        wad!.playpal.palettes[0]
    )
    
})()

export { read }
