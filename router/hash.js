// 前端路由
class HashRouter{
  constructor() {
    // 存储hash值对应的回调函数
    this.routers = {}
    window.addEventListener('hashchange', this.load.bind(this), false)
  }
  // 注册每一个视图
  register(hash, callback = () => {}){
    this.routers[hash] = callback
  }
  // 注册首页
  registerIndex(callback = ()=>{}) {
    this.routers['index'] = callback
  }
  // 异常处理
  registerError(callback = ()=>{}) {
    this.routers['error'] = callback
  }
  // 用于调用不同视图的回调函数
  load() {
    // hash 属性返回一个 USVString，其中会包含URL标识中的 '#' 和 后面URL片段标识
    const hash = location.hash.slice(1)
    let handler
    if (!hash) {
      // 没有hash默认为首页
      handler = this.routers.index
    } else {
      handler = this.routers[hash]
    }
    // 执行注册的回调函数
    try {
      handler()
    } catch (error) {
      console.error(error)
      this.routers['error'] && this.routers['error']()
    }
  }
}

const router = new HashRouter()
const container = document.getElementById('container')

router.registerIndex(()=> container.innerHTML = 'I am index')
router.register('/page1', () => container.innerHTML = 'I am page1')
router.register('/page2', () => container.innerHTML = 'I am page2')
router.register('/page3', () => container.innerHTML = 'I am page3')

router.load()
