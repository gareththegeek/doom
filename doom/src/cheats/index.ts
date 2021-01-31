import PubSub from 'pubsub-js'
import { G } from '../global'
import { ON_KEY_DOWN } from '../interfaces/messageTypes'
import { loadMap } from '../maps/loadMap'

const cheat = (() => {
    let code = 'AAAAAAAA'

    return (_: string, { key }: { key: string }): void => {
        const letter = key
        const { cheats } = G
        
        if (/[a-z0-9]/.test(letter)) {
            code = code.substr(1) + letter
            if (code.endsWith('idclip')) {
                cheats.noclip = !cheats.noclip
                console.log(`noclip ${cheats.noclip}`)
            }
            if (/idclev[1-4][1-9]/.test(code)) {
                const e = code[code.length - 2]
                const m = code[code.length - 1]
                const mapName = `e${e}m${m}`
                loadMap(mapName)
            }
        }
    }
})()

PubSub.subscribe(ON_KEY_DOWN, cheat)
