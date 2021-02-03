import { createSpriteLookup } from './createSpriteLookup'
import { readWad } from 'doom-wad'
import { Wad } from 'doom-wad/dist/interfaces/Wad'
import path from 'path'
import * as fs from 'fs'
import { createAtlas } from 'doom-atlas'

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
        const wad = await readFile(path.join(__dirname, '../../doom-test-harness/data/doom.wad'))
        if (!wad) {
            throw new Error('Unable to load doom.wad')
        }
        const atlas = createAtlas(wad, 4096)
        const result = createSpriteLookup(wad.sprites, atlas)
    } catch (e) {
        console.error(e.message)
    }
})()
