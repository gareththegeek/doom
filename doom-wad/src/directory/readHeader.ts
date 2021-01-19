import { readString } from '../binary'
import { WadIdentification, WadHeader } from '../interfaces/WadHeader'

const isWad = (identification: string): identification is WadIdentification =>
    identification === 'IWAD' || identification === 'PWAD'

export const readHeader = (data: Buffer): WadHeader => {
    const identification = readString(data, 0, 4)
    if (!isWad(identification)) {
        throw new Error(`Unsupported file format '${identification}'`)
    }

    const result = {
        identification,
        numlumps: data.readInt32LE(4),
        infotableofs: data.readInt32LE(8)
    }

    return result
}
