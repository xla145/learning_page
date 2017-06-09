// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import Vuex from 'vuex'
import ElementUI from 'element-ui'
import './assets/main.css'
import './assets/common.css'
import 'element-ui/lib/theme-default/index.css'
import axiosIntence from './common/axiosIntence'
import {serverHost} from './common/const.js'

// Vue.use(Vuex)

Vue.use(ElementUI) // 加载element组件

Vue.prototype.$http = axiosIntence // 设置http插件

Vue.prototype._uploadStudentFilePath = serverHost + '/manage/student/bathStudentAdd'

Vue.prototype._uploadTeacherFilePath = serverHost + '/manage/teacher/bathTeacherAdd'

Vue.prototype._uploadFilePath = serverHost + '/manage/user/upload'

Vue.config.productionTip = false

/* eslint-disable no-new */

// Vuex配置
// const store = new Vuex.Store({
//   state: {
//     domain: '', // 保存后台请求的地址，修改时方便（比方说从测试服改成正式服域名）
//     userInfo: { // 保存用户信息
//       nick: null,
//       ulevel: null,
//       uid: null,
//       portrait: null
//     }
//   },
//   mutations: {
//     // 更新用户信息
//     updateUserInfo: function (state, newUserInfo) {
//       state.userInfo = newUserInfo
//     }
//   }
// })

// 设置cookie,增加到vue实例方便全局调用
// vue全局调用的理由是，有些组件所用到的接口可能需要session验证，session从cookie获取
// 当然，如果session保存到vuex的话除外
// Vue.prototype.setCookie = (name, value, expiredays) => {
//   var exdate = new Date()
//   exdate.setDate(exdate.getDate() + expiredays)
//   document.cookie = name + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
// }

// 获取cookie、
// function getCookie (name) {
//   var arr = []
//   var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
//   if (arr === document.cookie.match(reg)) {
//     return (arr[2])
//   } else {
//     return null
//   }
// }
// Vue.prototype.getCookie = getCookie
//
// // 删除cookie
// Vue.prototype.delCookie = (name) => {
//   var exp = new Date()
//   exp.setTime(exp.getTime() - 1)
//   var cval = getCookie(name)
//   if (cval != null) {
//     document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
//   }
// }
new Vue({
  el: '#app',
  router,
  // store,
  template: '<App/>',
  components: { App },
  watch: {
    '$route': 'checkLogin'
  },
  created () {
    this.checkLogin()
  },
  methods: {
    checkLogin: function () {
      this.$http.post('/manage/user/getSessions', {showLoading: true}).then((response) => {
        let session = response.data
        console.log(session)
        // 检查是否存在session
        if (session === null) {
          // this.$message({type: 'error', message: '获取用户信息失败，请重新刷新页面重新登录'})
          this.$router.push('/login')
        }
      })
    }
  }
})
