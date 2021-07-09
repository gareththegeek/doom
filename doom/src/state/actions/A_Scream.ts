import { playSound } from '../../../../doom-audio/dist'
import { ObjectInfoLookup } from '../../interfaces/ObjectInfoLookup'
import { Stateful } from '../../interfaces/State'

export const A_Scream = (stateful: Stateful): void => {
    const info = Object.values(ObjectInfoLookup).find((info) => info.doomednum === stateful.thing!.type)

    playSound(info?.deathsound!)
    
    console.log(`Scream ${stateful.thing?.type}`)
}
