function parseParam(url) {
  // 获取？后的参数字符串
  const paramsStr = /.+\?([^\#]+)\#/.exec(url)[1]
  const paramArr = paramsStr.split('&') // 
  let paramsObj = {}
  paramArr.forEach( p => {
    if (/=/.test(p)) {
      const [key, value] = p.split('=')
      //一个解码后的统一资源标识符（URI）字符串，处理前的URI经过了给定格式的编码
      let val = decodeURIComponent(value)
      // 判断是否为数字，并转换
      val = /^\d+$/.test(val) ? parseFloat(val) : val
      // 如果已经有key了，直接变成数组push值
      if (paramsObj.hasOwnProperty(key)) {
        paramsObj[key] = [].concat(paramsObj[key], val)
      } else {
        paramsObj[key] = val
      }
    } else {
      paramsObj[p] = true
    }
  })
  return paramsObj
}

const url = 'http://test.com:8080?name=1&password=2&password#page1'

console.log(parseParam(url))