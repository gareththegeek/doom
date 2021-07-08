import { SoundFontPlayer } from '@magenta/music'
import { A } from './global'

export const initialiseAudioSystem = () => {
    const soundFontUrl = 'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus'
    A.midiplayer = new SoundFontPlayer(soundFontUrl)
}
