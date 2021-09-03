const curry = (fn, ...args) => 
  args.length >= fn.length
  ? fn(...args)
  : (..._args) => curry(fn, ...args,..._args);

function add1(x, y, z) {
  return x + y + z;
}

const add = curry(add1);
// console.log(add(1, 2, 3));
// console.log(add(1)(2)(3));
// console.log(add(1, 2)(3));
// console.log(add(1)(2, 3));

function argsSum(args){ 
  return args.reduce((pre, cur) => { 
    return pre + cur 
  }) 
}

// 关键：两个数组存着 arg1和,toString保存当前值，fn保存返回函数
function addT(...args1){
  let sum1 = argsSum(args1) 
  let fn = function(...args2){
    let sum2 = argsSum(args2) 
    console.log(sum1, sum2)
    return add(sum1 + sum2) 
  } 
  fn.toString = function(){ return sum1 } 
  return fn 
}


const Myadd = (...args1) => {
  const sum1 = args1.reduce((x, y) => x+y)

  const fn = (...args2) => {
    const sum2 = args2.reduce((x, y) => x+y)
    return Myadd(sum1+sum2)
  }
  fn.toString = () => {
    return sum1
  }
  return fn
}

console.log(Myadd(1, 4)(3,7)*1)
