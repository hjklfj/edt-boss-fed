import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({

})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}
// 使用axios新实例，不会被拦截器拦截
function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 改写config配置信息来实现业务功能的统一处理
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// 响应拦截器
let isRefreshing = false // 控制刷新 token 的状态k
let requests:any[] = [] // 存储刷新token期间401的请求
request.interceptors.response.use(function (response) {
  // 2xx 都会进入这里
  return response
}, async function (error) {
  // 超出2xx都会进入这里
  if (error.response) { // 请求发出去收到响应，但是状态码超出2xx范围
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // token无效(没有提供token, token无效， token过期了)
      if (!store.state.user) {
        // 失败了 => 跳转登录页重新登录获取新的 token
        redirectLogin()
        return Promise.reject(error)
      }

      if (!isRefreshing) {
        isRefreshing = true // 开启刷新状态
        // 尝试获取新的tokens
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新 Token 失败')
          }
          // 成功了,更新access_token
          store.commit('setUser', res.data.content)
          // 把requests中的请求重新发出去
          requests.forEach(db => db())
          requests = []
          // 把本次失败的请求重新发出去(error.config包含请求失败的配置信息)
          return request(error.config)
        }).catch(err => {
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(err)
        }).finally(() => {
          isRefreshing = false // 重置刷新状态
        })
      }
      // 刷新状态下，把请求挂起放到 requests数组中
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) { // 请求发出去没有收到响应
    Message.error('请求超时，请刷新重试')
  } else { // 设置请求时发生一些事情，出发一个错误
    Message.error(`请求失败：${error.message}`)
  }
  return Promise.reject(error)
})

export default request
