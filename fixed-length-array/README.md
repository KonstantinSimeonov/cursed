# Fixed length array

A flexible<sup>[1](#Glossary)</sup>, fixed-length, stack-allocated<sup>[2](#Glossary)</sup> generic array implementation leveraging the full power of the dynamic nature<sup>[3](#Glossary)</sup> of javascript and ES6 proxies to bring you a fast and type-safe<sup>[4](#Glossary)</sup> developer experience and create real-life, real-time performance apps<sup>[6](#Glossary)</sup>.

## Installation
```shell
npm i git+ssh://git@github.com/KonstantinSimeonov/cursed.git
```

## Getting started
```ts
import { mk_array } from "cursed/fixed-length-array/src/fixed-length-array"

const numbers = mk_array(4)

for (let i = 0; i < numbers.length; ++i) {
  numbers[i] = i
}

console.log(numbers)

let sum = 0
// we support iterators
for (const n of numbers) {
  sum += n
}

console.log({ sum })
```

---

## DesIgN pHiLosOpHy

![spongebob acting posh](./sponge.png)

<details>
    <summary>Deep dive</summary>

Not really. Just generate a bunch of variables based on `length`:

```js
const variables =
  Array.from({ length }, (_, i) => `let arr${i};`).join(`\n`)

// length 4
// let arr0;
// let arr1;
// let arr2;
// let arr4;
```

Random access reading is:

```js
const at = index => eval(`arr${index}`)
// at(0) -> eval(`arr0`)
// at(3) -> eval(`arr3`)
```

Random access writing is:

```js
const set = (index, value) =>eval(`arr${index} = value`)
// = value in the string makes the eval use the "value" with a closure

// set(0, [3]) -> arr0 = value
// ^ also works with references
```

Slap it in an iife and eval:

```js
const array = eval(`(() => {
  ${variables}
  ${at_source}
  ${set_source}

  return { at, set }
})()`)
```

Proxy on the eval'ed horror using at/set to make the bracket syntax work the same as the array.
</details>

### Glossary
1. `flexible` - something every library author says when their code can theoretically be used in different ways without accounting for the pain of actually doing so
2. `stack-allocated` - the variables `eval` creates are on the stack :3
3. `dynamic nature` - using eval
4. `type-safe` - only half of the types are `any`
5. `real-life, real-time performance apps` - stuff marketing people say
