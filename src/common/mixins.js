/**
 * Created by Administrator on 2017/5/9.
 */
export let logoutMixin = { // 用法 在页面中 import {gamesMixin} from '../../common/mixins.js'
  data: function () {
    return {
    }
  },
  methods: {
    logout: function () {
      this.$confirm('确认要退出登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sessionStorage.clear()
        this.$http.post('/manage/user/logout', {showLoading: true}).then((response) => {
          this.$router.push({path: '/login'})
        })
      }).catch(() => { })
    }
  }
}
