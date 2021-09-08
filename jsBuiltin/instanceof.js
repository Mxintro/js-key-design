// 首先获取类型的原型
// 然后获得对象的原型
// 然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为 null，因为原型链最终为 null

function myInstanceOf (left, right) {
  let proto = Object.getPrototypeOf(left)
  const prototype = right.prototype

  while(proto !== null) {
    if (proto === prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}

function Animal() {
  this.colors = ['black', 'yellow']
}

Animal.prototype.getColor = function() {
  return this.colors
}

function Dog() {

}

Dog.prototype = new Animal()

const dog1 = new Dog()

console.log(myInstanceOf(dog1, Dog))
