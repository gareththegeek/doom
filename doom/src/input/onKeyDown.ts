import PubSub from 'pubsub-js'
import { G } from '../global'
import { ON_KEY_DOWN } from '../interfaces/messageTypes'

export const onKeyDown = (event: KeyboardEvent): void => {
    const {
        input: { isPressed }
    } = G
    const { key } = event
    if (!isPressed[key]) {
        PubSub.publish(ON_KEY_DOWN, { key })
    }
    isPressed[key] = true
}
