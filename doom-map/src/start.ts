import { readWad } from 'doom-wad'
import { createAtlas } from 'doom-atlas/dist/index'
import * as path from 'path'
import { buildSectorList } from './buildSectorList'
import { createSectorBufferSetParams } from './createSectorBufferSetParams'
import { Wad } from 'doom-wad/dist/interfaces/Wad'

import * as fs from 'fs'
import { findSectorsThings } from './findSectorsThings'

export const readFile = async (filename: string): Promise<Wad | null> =>
    new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if (err) {
                reject(err)
            }

            const wad = readWad(data)

            resolve(wad)
        })
    })
;(async () => {
    try {
        const wad = await readFile(path.join(__dirname, '../data/doom.wad'))
        if (!wad) {
            throw new Error('Unable to load doom.wad')
        }
        const atlas = createAtlas(wad, 4096)
        const sectorlist = buildSectorList(wad.maps['e1m1'], atlas)
        const things = findSectorsThings(sectorlist, wad.maps['e1m1'].things)
        const params = createSectorBufferSetParams(sectorlist)
        console.log(params)
    } catch (e) {
        console.error(e.message)
    }
})()
