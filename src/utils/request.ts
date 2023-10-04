import axios from 'axios'
import store from '@/store'

const request = axios.create({

})

// Add a request interceptor
request.interceptors.request.use(function (config) {
  console.log('接口请求进来了', config)
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
export default request
