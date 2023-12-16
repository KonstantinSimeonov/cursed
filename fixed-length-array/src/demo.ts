import { mk_array } from "./fixed-length-array"

const xs = mk_array<number | object | RegExp>(10_000)

const a = { value: 20 }

xs[0] = 42
xs[1] = { a, b: 10 }
xs[2] = RegExp(`123`, `g`)

console.log(xs[0], xs[1], xs[2])
console.log(xs)

console.log(xs.length)
