import { WadSoundLump } from '../interfaces/WadSoundLump'
import { WadDirectoryEntry } from '../interfaces/WadDirectory'
import { dmx2wav } from 'dmx2wav'

export const readSoundLump = (data: Buffer, entry: WadDirectoryEntry): WadSoundLump => {
    const buffer = data.slice(entry.filepos, entry.filepos + entry.size)
    const wave = dmx2wav(buffer)
    const encoded = wave.toString('base64')

    return {
        dataUri: `data:audio/wave;base64,${encoded}`
    }
}
