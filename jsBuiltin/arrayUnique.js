// 数组去重
function unique(arr) {
  const map = {}
  return arr.filter(item => {
    if (map[item]===undefined) {
      map[item] = true
      return true
    }
  })
}

const arr = [2,3,44,5,1,2,3,44,5,0,0,0]
const arr2 = Array.from(new Set(arr))
// console.log(unique(arr))
// console.log(arr2)

// 数组
function flatten(arr) {
  let res = []
  for (const i of arr) {
    if (Array.isArray(i)) {
      res = [...res, ...flatten(i)]
    } else {
      res.push(i)
    }
  }
  return res
}

const arrFla = [2, [1, 5, [3]]]
console.log(flatten(arrFla))