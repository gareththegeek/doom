//https://github.com/cifkao/html-midi-player/blob/aee0a5c24f5b82e0a72179c2558e04d2eb295fba/src/player.ts#L49
import { blobToNoteSequence } from '@magenta/music'
import { A } from './global'

export const playMusic = async (name: string) => {
    const { midiplayer } = A
    const music = A.music[name].data

    const midiblob = new Blob([new Uint8Array(music, 0, music.length)])
    A.currentNoteSequence = await blobToNoteSequence(midiblob)

    midiplayer.stop()

    setTimeout(() => {
        midiplayer.start(A.currentNoteSequence)
    }, 0)
}
