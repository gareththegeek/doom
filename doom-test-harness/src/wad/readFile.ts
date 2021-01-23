import { readWad } from 'doom-wad'
import { Wad } from 'doom-wad/dist/interfaces/Wad'
import * as fs from 'fs'

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
