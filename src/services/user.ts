/**
 * 用户相关请求模块
 */

import request from '@/utils/request'
import qs from 'qs'
import store from '@/store'

interface User {
  phone: string
  password: string
}
export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // 如果data 是普通对象， content-type是application/json,
    // 如果data 是qs.stringify(data)转换之后的数据：key=value&key=value, content-type是application/x-www-form-urlencoded
    // 如果data 是formData对象， content-type是multipart/form-data
    data: qs.stringify(data) // axios 默认发送的是 application/json 格式的数据
  })
}

export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}
