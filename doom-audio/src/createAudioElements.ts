import { WadLookup } from 'doom-wad/dist/interfaces/Wad'
import { WadSoundLump } from 'doom-wad/dist/interfaces/WadSoundLump'

const createAudioElement = (dataUri: string): HTMLAudioElement => {
    // HACK If I use the `new Audio(uri)` interface an error is thrown but by manually creating the audio element it works
    const audio = document.createElement('audio')
    audio.addEventListener('canplay', () => { console.log('canplay')/*; audio.play()*/ })
    const source = document.createElement('source')
    source.src = dataUri
    source.type = 'audio/wav'
    audio.appendChild(source)
    return audio
}

export const createAudioElements = (sounds: WadLookup<WadSoundLump>): WadLookup<HTMLAudioElement> => {
    const result: WadLookup<HTMLAudioElement> = {}
    for (const [key, value] of Object.entries(sounds)) {
        result[key] = createAudioElement(value.dataUri)
    }
    return result
}
