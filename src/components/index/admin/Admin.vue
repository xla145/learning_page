<template xmlns="http://www.w3.org/1999/html">
  <div id="app">
    <header>
      <div class="title">后台管理系统</div>
      <div class="content">
        <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        {{userName}}<i class="el-icon--right"></i>
      </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><el-button type="text" @click="userInfo">个人信息</el-button></el-dropdown-item>
            <el-dropdown-item><el-button type="text" @click="updatePwd">修改密码</el-button></el-dropdown-item>
            <el-dropdown-item><el-button type="text" @click="logout">退出登录</el-button></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <img src="../../../assets/user.png">
      </div>
    </header>
    <main>
      <!-- 左侧导航 -->
      <div class="main-left">
        <el-menu default-active="/manage/admin/student" class="el-menu-vertical-demo" :router="true">
          <el-menu-item index="/manage/admin/student"><i class="el-icon-message">&nbsp;学生管理</i></el-menu-item>
          <el-menu-item index="/manage/admin/teacher"><i class="el-icon-setting">&nbsp;老师管理</i></el-menu-item>
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
        dialogFormVisible: false,
        headerFixed: true,
        collapsed: '',
        userName: ''
//        imgPath: ''
      }
    },
    created: function () {
      this.$router.push('/manage/admin/student')
      if (sessionStorage.getItem('user') !== null) {
        this.userName = JSON.parse(sessionStorage.getItem('user')).name
      }
    },
    methods: {
      updatePwd: function () {
        this.$router.push({path: '/manage/admin/message'})
      },
      info: function () {
        this.$router.push({path: '/manage/admin/userInfo'})
      }
    }
  }
</script>

<style>
</style>
