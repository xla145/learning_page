<template xmlns="http://www.w3.org/1999/html">
  <div id="app">
    <header>
      <div class="title">后台管理系统</div>
      <div class="content">
        <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        {{userName}}<i class="el-icon--right"></i>
        <img src="../../../assets/user.png">
      </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><el-button type="text">个人信息</el-button></el-dropdown-item>
            <el-dropdown-item><el-button type="text" @click="updatePwd">修改密码</el-button></el-dropdown-item>
            <el-dropdown-item><el-button type="text" @click="logout">退出登录</el-button></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
    <main>
      <!-- 左侧导航 -->
      <div class="main-left">
        <el-menu default-active="/manage/student/topic" class="el-menu-vertical-demo" :router="true">
          <el-menu-item index="/manage/student/topic" ><i class="el-icon-message">&nbsp;个人话题管理</i></el-menu-item>
          <el-menu-item index="/manage/student/answer" ><i class="el-icon-setting">&nbsp;在线提问</i></el-menu-item>
          <el-menu-item index="/manage/student/publicTopic"><i class="el-icon-share">&nbsp;所有话题</i></el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧主内容区 -->
      <div class="main-right" >
        <transition name="fade">
          <router-view class="view"></router-view>
        </transition>
      </div>
    </main>
  </div>
</template>

<script>
  import {logoutMixin} from '../../../common/mixins.js'
  export default {
    name: 'student',
    mixins: [logoutMixin],
    data: function () {
      return {
        headerFixed: true,
        collapsed: '',
        userName: ''
//        imgPath: ''
      }
    },
    created: function () {
      this.$router.push('/manage/student/topic')
      if (sessionStorage.getItem('user') !== null) {
        this.userName = JSON.parse(sessionStorage.getItem('user')).name
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
          this.$router.push({path: '/login'})
        }).catch(() => { })
      },
      updatePwd: function () {
        this.$router.push({path: '/manage/student/message'})
      }
    },
    watch: {
      '$route': function (to, from) {
        if (to.path === '/manage/student/topic') {
          this.active = true
        } else if (to.path === '/manage/student/answer') {
          this.active = false
        }
      }
    }
  }
</script>

<style>
</style>
