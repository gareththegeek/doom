import * as fs from 'fs'
import { readDirectory } from './directory'
import { Wad } from './interfaces/Wad'

export const read = async (filename: string): Promise<Wad | null> =>
    new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if (err) {
                reject(err)
            }

            const directory = readDirectory(data)

            console.log(directory)

            resolve(null)
        })
    })
