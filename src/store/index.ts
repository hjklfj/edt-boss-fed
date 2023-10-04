import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || 'null') // 当前登陆用户状态
  },
  mutations: {
    // 修改容器数据必须使用mutation函数
    setUser (state, payload) {
      state.user = JSON.parse(payload)
      // 防止页面刷新数据丢失(localStorage只能存字符串)
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
