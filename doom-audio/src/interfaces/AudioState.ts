import { NoteSequence, SoundFontPlayer } from '@magenta/music'
import { WadLookup } from 'doom-wad/dist/interfaces/Wad'
import { WadMusicLump } from 'doom-wad/dist/interfaces/WadMusicLump'

export interface AudioState {
    midiplayer: SoundFontPlayer
    music: WadLookup<WadMusicLump>
    sounds: WadLookup<HTMLAudioElement>
    currentNoteSequence: NoteSequence
}
