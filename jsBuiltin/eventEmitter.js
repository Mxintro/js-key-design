// 事件总线（发布订阅模式）
class EventEmitter {
  constructor() {
    this.cache() = {}
  }
  on(name, fn) {
    let task = this.cache[name]
    if (task) {
      const index = task.findIndex(f => f === fn || f.callback === fn)
      if (index >= 0) {
        
      }
    }
  }
}