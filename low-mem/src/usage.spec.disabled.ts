// import { LinkedList } from './LinkedList'
// import { LmArray } from './LmArray'

// const SOME_DATA = new Array(10000).fill(Math.random() * 100)

// describe('Memory usage', () => {
//     it('check array usage', () => {
//         global.gc()
//         const start = process.memoryUsage()
//         const startT = performance.now()
//         const a = []
//         for (let j = 0; j < 1000; j++) {
//             for (let i = 0; i < 10000; i++) {
//                 a.push(SOME_DATA[i])
//             }
//             for (let i = 0; i < 10000; i++) {
//                 a.splice(0, 1)
//             }
//         }
//         const end = process.memoryUsage()
//         global.gc()
//         const collect = process.memoryUsage()
//         const endT = performance.now()
//         console.log('Array', end.heapUsed - start.heapUsed, end.heapUsed - collect.heapUsed, endT - startT)
//     })

//     it('check linked list usage', () => {
//         global.gc()
//         const start = process.memoryUsage()
//         const startT = performance.now()
//         const ll = new LinkedList()
//         for (let j = 0; j < 1000; j++) {
//             for (let i = 0; i < 10000; i++) {
//                 ll.add(SOME_DATA[i])
//             }
//             for (let i = 0; i < 10000; i++) {
//                 ll.remove(ll.next()!.item)
//             }
//         }
//         const end = process.memoryUsage()
//         global.gc()
//         const collect = process.memoryUsage()
//         const endT = performance.now()
//         console.log('Linked List', end.heapUsed - start.heapUsed, end.heapUsed - collect.heapUsed, endT - startT)
//     })

//     it('check lmarray usage', () => {
//         global.gc()
//         const start = process.memoryUsage()
//         const startT = performance.now()
//         const lm = new LmArray()
//         for (let j = 0; j < 1; j++) {
//             for (let i = 0; i < 10000; i++) {
//                 lm.add({ foo: i })
//             }
//             for (let i = 0; i < 10000; i++) {
//                 lm.remove(lm.get(Math.floor(Math.random() * lm.length())))
//             }
//         }
//         const end = process.memoryUsage()
//         global.gc()
//         const collect = process.memoryUsage()
//         const endT = performance.now()
//         console.log(
//             'Low Mem Array',
//             end.heapUsed - start.heapUsed,
//             end.heapUsed - collect.heapUsed,
//             (endT - startT) * 1000
//         )
//     })
// })
