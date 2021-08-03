// 观察者模

const queuedObservers = new Set()

const observe = watcher => queuedObservers.add(watcher)
const observable = obj => new Proxy(obj, {set})

function set (target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver)
  queuedObservers.forEach(observer => observer())
  return result
}

const person = observable({
  name: '张三',
  age: 20
});

function print() {
  console.log(`${person.name}, ${person.age}`)
}

observe(print)
observable(person)