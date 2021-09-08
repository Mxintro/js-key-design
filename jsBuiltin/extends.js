// 原理
// 原型链继承
function Animal() {
  this.colors = ['black', 'yellow']
}

Animal.prototype.getColor = function() {
  return this.colors
}

// function Dog() {

// }

Dog.prototype = new Animal()

const dog1 = new Dog()
dog1.colors.push('brown')
const dog2 = new Dog()
// console.log(dog2.colors)
// 问题1：原型中包含的引用类型属性将被所有实例共享；
// 问题2：子类在实例化的时候不能给父类构造函数传参；

// 借用构造函数实现继承
function Animal1(name) {
  console.log(name)
  this.name = name
  this.getName = function() {
    return this.name
  }
}

function Dog(name) {
  Animal1.call(this, name)
}

const dog3 = new Dog('hello')
console.log(dog3.getName())
// Dog.prototype = new Animal()

// 组合继承
