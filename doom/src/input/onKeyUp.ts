import PubSub from 'pubsub-js'
import { G } from '../global'
import { ON_KEY_UP } from '../interfaces/messageTypes'

export const onKeyUp = (event: KeyboardEvent): void => {
    const {
        input: { isPressed }
    } = G
    const { key } = event
    isPressed[key] = false
    PubSub.publish(ON_KEY_UP, { key })
}
