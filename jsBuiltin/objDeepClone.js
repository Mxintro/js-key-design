
function deepClone (target, map = new Map()) {
  // 判断 Date、RegExp
  if (/^(RegExp|Date)$/i.test(target?.constructor.name)) {
    return new target.constructor(target)
  }

  if (Array.isArray(target)) {
    return target.map(item => deepClone(item, map))
  }

  if (typeof target === 'object' && target !== null) {
    if (map.get(target)) {
      return target
    }
    map.set(target, true) 
    const clone = target ? {} : null
    Object.keys(target).forEach(key => {
      clone[key] = deepClone(target[key], map)
    })
    return clone
  } 
  return target
}

const t = new Date()
const target = {
  a: 1,
  b: [1, {b1: 3}],
  c: {c1: {c2: 9}},
  d: null,
  e: /.+\?.+/,
  f: t 
}
target.g = target

console.log(target)

console.log(deepClone(target))