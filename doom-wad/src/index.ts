import { read } from './read'
import * as path from 'path'

;(async () => {
    read(path.join(__dirname, '../data/doom.wad'))
})()

export { read }
