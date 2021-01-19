import * as fs from 'fs'
import { Wad } from './interfaces/Wad'
import { readWad } from './wad'

export const read = async (filename: string): Promise<Wad | null> =>
    new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if (err) {
                reject(err)
            }

            const wad = readWad(data)

            resolve(wad)
        })
    })
