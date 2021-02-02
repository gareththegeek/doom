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
        player: { thing },
        map: { blockmap }
    } = G
    use(blockmap, thing)
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
    if (line.special === 0) {
        return
    }

    console.info(
        `${type} Activated line ${line.index} with special type ${line.special} and sector tag ${line.sectorTag}`
    )
    const activation = ActivateLookup[line.special]
    if (activation !== undefined) {
        const { trigger, handler } = activation
        const sectors = trigger(getActivationType(type), line)
        sectors.forEach((sector) => handler(sector))
    }
}

PubSub.subscribe(WALK_LINE, activate)
PubSub.subscribe(SWITCH_LINE, activate)
