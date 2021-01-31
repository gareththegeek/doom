import { readWad } from 'doom-wad'
import { createAtlas } from 'doom-atlas/dist/index'
import * as path from 'path'
import { Wad } from 'doom-wad/dist/interfaces/Wad'
import * as fs from 'fs'
import { createMap } from '.'
import { SkillType } from './interfaces/MapFlags'

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
        const map = createMap(atlas, wad.maps['e1m1'], {
            multiplayer: false,
            skill: SkillType.skill45
        })
        console.log(map)
    } catch (e) {
        console.error(e.message)
    }
})()
