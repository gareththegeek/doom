// import { readFile } from 'doom-wad'
// import { createAtlas } from 'doom-atlas/dist/index'
// import * as path from 'path'
// import { createSectorData } from './createSectorData'
// ;import { createSectorBufferSetParams } from './createSectorBufferSetParams';
// (async () => {
//     try {
//         const wad = await readFile(path.join(__dirname, '../data/doom.wad'))
//         if (!wad) {
//             throw new Error('Unable to load doom.wad')
//         }
//         const atlas = createAtlas(wad, 4096)
//         const sectorlist = createSectorData(wad, atlas, 'e1m1')
//         const params = createSectorBufferSetParams(sectorlist)
//         console.log(params)
//     } catch (e) {
//         console.error(e.message)
//     }
// })()