import { SoundFontPlayer } from '@magenta/music'
import { WadLookup } from 'doom-wad/dist/interfaces/Wad'
import { WadMusicLump } from 'doom-wad/dist/interfaces/WadMusicLump'
import { WadSoundLump } from 'doom-wad/dist/interfaces/WadSoundLump'
import { createAudioElements } from './createAudioElements'
import { A } from './global'

export const initialiseAudioSystem = (music: WadLookup<WadMusicLump>, sounds: WadLookup<WadSoundLump>) => {
    const soundFontUrl = 'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus'
    A.midiplayer = new SoundFontPlayer(soundFontUrl, undefined, undefined, undefined, {
        run: () => { },
        stop: () => { A.midiplayer.start(A.currentNoteSequence) }
    })
    A.music = music
    A.sounds = createAudioElements(sounds)
}
