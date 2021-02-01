import PubSub from 'pubsub-js'
import { Line } from 'doom-map'
import { use } from '../collisions/use'
import { G } from '../global'
import { ON_KEY_DOWN, SWITCH_LINE, WALK_LINE } from '../interfaces/messageTypes'
import { ActivateLookup, ActivationType } from './ActivateLookup'

PubSub.subscribe(ON_KEY_DOWN, (_: string, { key }: { key: string }) => {
    if (key !== ' ') {
        return
    }

    const {
        player,
        map: { blockmap }
    } = G
    use(blockmap, player)
})

const getActivationType = (type: string): ActivationType => {
    switch (type) {
        case SWITCH_LINE:
            return ActivationType.Switch
        case WALK_LINE:
            return ActivationType.Walk
        default:
            throw new Error(`Unexpected activation type ${type}`)
    }
}

const activate = (type: string, { line }: { line: Line }): void => {
    console.log('activate')
    if (line.special === 0) {
        return
    }

    console.log(
        `${type} Activated line ${line.index} with special type ${line.special} and sector tag ${line.sectorTag}`
    )
    const handler = ActivateLookup[line.special]
    if (handler !== undefined) {
        handler(getActivationType(type), line)
    }
}

PubSub.subscribe(WALK_LINE, activate)
PubSub.subscribe(SWITCH_LINE, activate)
