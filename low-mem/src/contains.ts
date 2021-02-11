import { LinkedList } from '.'
import { findLinkedList } from './findLinkedList'

export const contains = <T>(list: LinkedList<T>, object: T): boolean =>
    findLinkedList(list, (other) => object === other) !== undefined
