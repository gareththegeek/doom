import { A } from './global'

export const playSound = (name: string): void => {
    const audio = A.sounds[name]
    audio.play()
}
