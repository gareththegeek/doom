import { read } from './read'
import * as path from 'path'
import { writeColorMapLump, writePlayPalLump } from './palettes'
import { writePictureLumps } from './textures/writePictureLumps'
import { writeFlatLump } from './flats'
import { writeTextureLumps } from './textures/writeTextureLumps'
;(async () => {
    const wad = await read(path.join(__dirname, '../data/doom.wad'))
    await writePlayPalLump(path.join(__dirname, '../out/palettes/'), wad!.playpal)
    await writeColorMapLump(
        path.join(__dirname, '../out/palettes/colormap.png'),
        wad!.colormap,
        wad!.playpal.palettes[0]
    )
    await writePictureLumps(
        path.join(__dirname, '../out/patches/'),
        wad!.patches,
        wad!.colormap.maps[0],
        wad!.playpal.palettes[0]
    )
    await writePictureLumps(
        path.join(__dirname, '../out/sprites/'),
        wad!.sprites,
        wad!.colormap.maps[0],
        wad!.playpal.palettes[0]
    )
    await writeFlatLump(
        path.join(__dirname, '../out/flats/'),
        wad!.flats,
        wad!.colormap.maps[0],
        wad!.playpal.palettes[0]
    )
    await writeTextureLumps(
        path.join(__dirname, '../out/textures/'),
        wad!.pnames.names,
        wad!.texture1,
        wad!.patches,
        wad!.colormap.maps[0],
        wad!.playpal.palettes[0]
    )
    if (!!wad?.texture2) {
        await writeTextureLumps(
            path.join(__dirname, '../out/textures/'),
            wad!.pnames.names,
            wad!.texture2,
            wad!.patches,
            wad!.colormap.maps[0],
            wad!.playpal.palettes[0]
        )
    }

    console.log(wad!.maps['e1m1'].sectors.sectors)
})()

export { read }
