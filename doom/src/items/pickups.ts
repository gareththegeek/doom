import { G } from '../global'
import { StatefulObjectThing } from '../interfaces/State'

export const pickups = (stateful: StatefulObjectThing[]): void => {
    const pickupable = stateful.filter(
        ({ info: { flags } }) => flags.special || flags.countitem || flags.pickup || flags.dropped
    )
    pickupable.forEach((stateful) => {
        const { block, sector, geometry, state, thing } = stateful
        block.statefuls.splice(block.statefuls.indexOf(stateful))
        sector.statefuls.splice(sector.statefuls.indexOf(stateful))
        geometry.visible = false

        console.info(`Picked up ${state.spriteName}`)
        const { type } = thing
        const { playerState } = G.player
        if (type === 5 || type === 40) {
            playerState.keys.blue = true
        }
        if (type === 13 || type === 38) {
            playerState.keys.red = true
        }
        if (type === 6 || type === 39) {
            playerState.keys.yellow = true
        }
    })
}
