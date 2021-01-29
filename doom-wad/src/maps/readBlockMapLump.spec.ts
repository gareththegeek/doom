import * as path from 'path'
import * as fs from 'fs'
import { readBlockMapLump } from './readBlockMapLump'

describe('readBlockMapLump', () => {
    const getWad = (): Promise<Buffer> => {
        const filename = path.join(__dirname, '../../../doom-test-harness/data/doom.wad')
        return new Promise((resolve, reject) =>
            fs.readFile(filename, (err, data) => {
                if (err) {
                    reject(err)
                }

                resolve(data)
            })
        )
    }

    it('successfully processes e1m1 blockmap', async () => {
        const data = await getWad()
        const entry = { filepos: 108420, size: 6948, name: 'blockmap' }

        const actual = readBlockMapLump(data, entry)
        expect(actual.blocks.length).toEqual(36)
        expect(actual.blocks[0].length).toEqual(23)
        expect(actual.xorigin).toEqual(-776)
        expect(actual.yorigin).toEqual(-4872)

        expect(actual.blocks[7][13].linedefs).toEqual([79, 80, 81, 82, 83, 84, 85, 88, 89])
    })
})
