import PubSub from 'pubsub-js'
import { G } from '../global'
import { ON_KEY_DOWN } from '../interfaces/messageTypes'

export const onKeyDown = (event: KeyboardEvent): void => {
    const { key } = event
    G.input.isPressed[key] = true
    PubSub.publish(ON_KEY_DOWN, { key })
}
