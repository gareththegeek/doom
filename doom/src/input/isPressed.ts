import { G } from '../global'

export const isPressed = (key: string): boolean => {
    const {
        input: { isPressed }
    } = G
    return !!isPressed[key]
}
