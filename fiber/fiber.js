// 虚拟dom => fiber => effect List => 渲染真实dom

// 定义一个虚拟dom
let style = {}
const virtaulDOM = {
  type: 'div',
  key: 'A',
  props: {
    style,
    children: [
      {type: 'div', key: 'B1', props:{style, children: 'B1文本'}},
      {type: 'div', key: 'B2', props:{style, children: 'B2文本'}}
    ]
  }
}

let workInProgress
const root = document.getElementById('root')
const TAG_HOST = 'TAG_HOST'
const TAG_ROOT = 'TAG_ROOT'
const Placement = 'Placement'
// fiber的跟节点
let rootFiber = {
  tag: TAG_ROOT, //  Fiber节点类型，为根节点
  key: 'ROOT',// 唯一标识
  stateNode: root,// fiber节点对应的真实dom节点
  props: {children: [virtaulDOM]}// children,子节点
}

// 工作循环
// workInProgress 是fiber树（链表）
function workLoop() {
  // 这里控制程序的执行
  while (workInProgress) {
    workInProgress = performUnitOfWork(workInProgress)
  }
  console.log(rootFiber)
  commitRoot(rootFiber)
}

function commitRoot(rootFiber) {
  let currentEffect = rootFiber.firstEffect
  while (currentEffect) {
    const flags = currentEffect.flags
    switch(flags) {
      case Placement:
        commitPlacement(currentEffect)
    }
    currentEffect = currentEffect.nextEffect
  }
}

function commitPlacement(currentEffect) {
  const parent = currentEffect.return.stateNode
  parent.appendChild(currentEffect.stateNode)
}


// 接受当前fiber节点，返回节点的child/sibling/undefined
function performUnitOfWork(workInProgress) {
  // 以当前节点为根构建fiber树
  beginWork(workInProgress)
  
  if(workInProgress.child) {
    return workInProgress.child
  }
  // while 保证节点遍历完全
  while (workInProgress) {
    // 没有子节点，完成本节点
    completeUnitOfWork(workInProgress)
    if (workInProgress.sibling) {
      return workInProgress.sibling
    }
    workInProgress = workInProgress.return
  }
}

// 此时，创建真实dom
function completeUnitOfWork(workInProgress) {
  let stateNode
  switch(workInProgress.tag) {
    case  TAG_HOST:
      stateNode = createStateNode(workInProgress)
      break
  }
  // 判断当前fiber节点有没有对应的DOM操作 
  makeEffectList(workInProgress)
}

// effectList不是包含所有节点，只包含有副作用的节点，即要对dom进行操作
// 第一次构建包含所有节点
// 过程： 把自己的effctList接到父节点effctList尾部，最后将自己添加到effectList最后
// 最后root得出一个包含所有effect的effectList
function makeEffectList(completeWork) {
  const returnFiber = completeWork.return
  if (returnFiber) {
    // 父effectlist不存在，第一个子节点的情况
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = completeWork.firstEffect
    }
    // 维护一个lastEffect，有LastEffect必有firstEffect
    if (completeWork.lastEffect) {
      // 父链表链接本链表
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = completeWork.firstEffect
      }
      // 连接完场指向最后
      returnFiber.lastEffect = completeWork.lastEffect
    }
    // 边界情况，叶子没有effectlist
    if (completeWork.flags) {
      // 一般情况
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = completeWork
      } else {
        // 第一个子节点作为表头
        returnFiber.firstEffect = completeWork
      }
      // 将自己添加到父effectList最后
      returnFiber.lastEffect = completeWork
    }
  }
}

// 将真实dom挂在fiber上
function createStateNode(fiber) {
  if (fiber.tag ===  TAG_HOST) {
    const stateNode = document.createElement(fiber.type)
    fiber.stateNode = stateNode
  }
  return fiber.stateNode
}

// 根据当前的fiber和虚拟dom构建fiber树
function beginWork(workInProgress) {
  const childrens = workInProgress.props?.children
  if (childrens instanceof Array){
    return reconcileChildren(workInProgress, childrens)
  }
}

// 根据父Fiber和子虚拟dom数组，构建当前returnFiber的子Fiber树
function reconcileChildren(returnFiber, childrens) {
  let preFiber, firstChild
  for (const child of childrens) {
    const newFiber = createFiber(child)
    // 对dom的操作类型
    newFiber.flags = Placement
    newFiber.return = returnFiber
    if (!firstChild) {
      returnFiber.child = firstChild = newFiber
    } else {
      preFiber.sibling = newFiber
    }
    preFiber = newFiber
  }
  return firstChild
}

function createFiber(element) {
  return {
    tag: TAG_HOST, // 原生DOM
    type: element.type, // div p span...
    key: element.key, // uni id
    props: element.props // props
  }
}


workInProgress = rootFiber
workLoop()

// effect表示将要对dom进行的操作
// dom diff 就是根据老的fibert树和最新的jsx对比生成新的fiber树