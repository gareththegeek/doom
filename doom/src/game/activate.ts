import PubSub from 'pubsub-js'
import { Line } from 'doom-map'
import { use } from '../collisions/use'
import { G } from '../global'
import { ON_KEY_DOWN } from '../interfaces/messageTypes'

export type ActivateHandler = (line: Line) => void
export const ActivateLookup: { [special: number]: ActivateHandler } = {}

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

export const activate = (line: Line): void => {
    console.log(`Activated line ${line.index} with special type ${line.special} and sector tag ${line.sectorTag}`)
    const handler = ActivateLookup[line.special]
    if (handler !== undefined) {
        handler(line)
    }
}
