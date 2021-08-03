// 由于 history.pushState() 和 history.replaceState() 可以改变 url 同时，不会刷新页面，
// 所以在 HTML5 中的 histroy 具备了实现前端路由的能力。
// 而 history 的改变并不会触发任何事件，所以我们无法直接监听 history 的改变而做出相应的改变。

class HistoryRouter {
  constructor() {
    this.routers = {}
    // this.listenPopState()
    this.listenLink()
  }
  //监听popstate
  listenPopState() {
    //只有在做出浏览器动作时，才会触发该事件，如用户点击浏览器的回退按钮
    //（或者在Javascript代码中调用history.back()或者history.forward()方法）
    window.addEventListener('popstate', (e) => {
      const state = e.state || {}, path = state.path || ''
      this.dealPathHandler(path)
    }, false)//第三个参数是一个布尔值表示是否在捕获阶段调用事件处理程序
  }
  // 局监听A链接
  listenLink () {
    window.addEventListener('click', (e) => {
      const dom = e.target
      if (dom.tagName.toUpperCase() === 'A' && dom.getAttribute('href')) {
        e.preventDefault()
        this.push(dom.getAttribute('href'))
      }
    }, false)
  }
  load() {
    this.dealPathHandler(location.pathname)
  }
  register(path, callback = () => {}) {
    this.routers[path] = callback
  }
  // 注册首页
  registerIndex(callback = ()=>{}) {
    this.routers['/'] = callback
  }
  // 异常处理
  registerError(callback = ()=>{}) {
    this.routers['error'] = callback
  }
  //用于处视图未找到的情况
  registerNotFound(callback = function(){}){
    this.routers['404'] = callback;
  }
  // push跳转
  push(path) {
    history.pushState({path}, null, path)
    this.dealPathHandler(path)
  }
  //替换为path
  replace(path){
    history.replaceState({path},null,path);
    this.dealPathHandler(path)
  }
  // 处理path调用回调函数
  dealPathHandler (path) {
    let handler
    if (!this.routers.hasOwnProperty(path)) {
      handler = this.routers['404'] || function(){}
    }else {
      handler = this.routers[path]
    }
    try {
      handler()
    } catch (e) {
      console.error(e)
      this.routers?.error()
    }
  }
}

const router = new HistoryRouter();
const container = document.getElementById('container');

//注册首页回调函数
router.registerIndex(() => container.innerHTML = '我是首页');

//注册其他视图回到函数
router.register('/page1', () => container.innerHTML = '我是page1');
router.register('/page2', () => container.innerHTML = '我是page2');
router.register('/page3', () => container.innerHTML = '我是page3');
router.register('/page4', () => {
    throw new Error('抛出一个异常')
});
console.log(router)

document.getElementById('btn').onclick = () => router.push('/page2')


//注册未找到对应path值时的回调
router.registerNotFound(() => container.innerHTML = '页面未找到');
//注册出现异常时的回调
router.registerError((e) => container.innerHTML = '页面异常，错误消息：<br>' + e.message);
//加载页面
router.load();
