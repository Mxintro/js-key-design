// 我们会在父函数销毁时，把子函数引用到的变量打成 Closure 包放到函数的 [[Scopes]] 上，让它计算父函数销毁了也随时随地能访问外部环境。

function fun1() {
  const o = 2
  const c1 = 1
  return function() {
    const c2 = 2
    const outer = 2
    console.log(c1)
    eval
    return () => {
      const c3 = 3
      console.log(c1)
      console.log(c2)
      console.log(c3)
    }
  }
}

const f2 = fun1()
const f3 = f2()
f3()