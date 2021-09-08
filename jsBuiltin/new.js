//（1）首先创建了一个新的空对象
//（2）设置原型，将对象的原型设置为函数的 prototype 对象。
//（3）让函数的 this 指向这个对象，执行构造函数的代码（为这个新对象添加属性）
//（4）判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象。
/**
 * @param constructor
 * @return obj
 */
function myNew(constructor, ...args) {
  if (typeof constructor !== 'function') {
    console.error('type Error')
    return
  }
  // create将传入的对象作为原型,返回一个对象
  const obj = Object.create(constructor.prototype)
  const res = constructor.apply(obj, args)
  // 如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象
  return res && (typeof res === 'object' || typeof res === 'function') ? res : obj
}

const obj = myNew(function(name){
  this.name = name
}, 'hello')

console.log(obj)