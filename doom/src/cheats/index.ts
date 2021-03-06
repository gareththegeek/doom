import PubSub from 'pubsub-js'
import { G } from '../global'
import { ON_KEY_DOWN } from '../interfaces/messageTypes'
import { changeLevel } from '../maps/changeLevel'

const cheat = (() => {
    let code = 'AAAAAAAA'

    return (_: string, key: string): void => {
        const letter = key
        const {
            cheats,
            player: { playerState }
        } = G

        if (/^[a-z0-9]{1}$/.test(letter)) {
            code = code.substr(1) + letter
            if (code.endsWith('idclip')) {
                cheats.noclip = !cheats.noclip
                console.info(`noclip ${cheats.noclip}`)
            }
            if (code.endsWith('idkfa')) {
                playerState.keys.blue = true
                playerState.keys.red = true
                playerState.keys.yellow = true
                console.info('I can only give keys for now :P')
            }
            if (/idclev[1-4]{1}[1-9]{1}$/.test(code)) {
                const e = code[code.length - 2]
                const m = code[code.length - 1]
                const mapName = `e${e}m${m}`
                changeLevel(mapName)
            }
        }
    }
})()

PubSub.subscribe(ON_KEY_DOWN, cheat)
