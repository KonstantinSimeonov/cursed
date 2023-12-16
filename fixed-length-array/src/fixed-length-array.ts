const util = require(`util`)

const handlers = {
  get(target: any, prop: string | symbol) {
    if (prop in target)
      return target[prop]

    return target.at(prop)
  },
  set(target: any, prop: string | symbol, value: unknown) {
    if (prop in target)
      return target[prop] = value

    return target.set(prop, value)
  }
}

export type FixedArray<T> = Iterable<T> & {
  [index: number]: T
  length: number
}

export const mk_array = <T>(length: number): FixedArray<T> => {
  const source =
`(() => {
  ${Array.from({ length }, (_, i) => `let arr${i};`).join(`\n  `)}
  const at = index => eval("arr" + index);

  // tribute to java
  const impl = {
    at,
    set: (index, value) => eval("arr" + index + " = value"),
  }

  return impl
})()`

  const memory = eval(source);

  const toString = () => "[" + Array.from(
    { length },
    (_, i) => util.inspect(memory.at(i))
  ).join(", ") + "]";

  const array = {
    ...memory,
    length,
    toString,
    get [Symbol.toStringTag]() {
      return toString()
    },
    [util.inspect.custom]: toString,
    *[Symbol.iterator]() {
      for (let i = 0; i < length; ++i) {
        yield eval("arr" + i)
      }
    }
  }

  return new Proxy(array, handlers)
}
