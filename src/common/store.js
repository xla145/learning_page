/**
 * Created by Administrator on 2017/5/8.
 */


// Vuex配置
const store = new Vuex.Store({
  state: {
    domain: '', //  保存后台请求的地址，修改时方便（比方说从测试服改成正式服域名）
    userInfo: { // 保存用户信息
      uid: null,
      name: null
    }
  },
  mutations: {
    // 更新用户信息
    updateUserInfo: function (state, newUserInfo) {
      state.userInfo = newUserInfo
    }
  }
})
