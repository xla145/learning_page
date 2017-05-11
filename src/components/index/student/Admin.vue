<template xmlns="http://www.w3.org/1999/html">
  <div id="app">
    <header>
      <div class="title">后台管理系统</div>
      <div class="content">
        <img src="../../../assets/logo.png" width="40px"/>
        <span>xla</span>
        <el-button type="text">退出登录</el-button>
      </div>
    </header>
    <main>
      <!-- 左侧导航 -->
      <div class="main-left">
        <el-menu default-active="/message" class="el-menu-vertical-demo" :router="true">
          <el-menu-item index="/message" :class="{'isActive': active}">个人信息</el-menu-item>
          <el-menu-item index="/topic" :class="{'isActive': !active}">话题管理</el-menu-item>
          <el-menu-item index="/answer" :class="{'isActive': !active}">在线提问</el-menu-item>
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
  export default {
    name: 'student',
    data: function () {
      return {
        active: true,
        headerFixed: true,
        collapsed: '',
        sysName: '系统管理员'
      }
    },
    created: function () {
      this.$router.push({path: '/message'})
    },
    methods: {

    },
    watch: {
      '$route': function (to, from) {
        if (to.path === '/message') {
          this.active = true
        } else if (to.path === '/topic') {
          this.active = false
        }
      }
    }
  }
</script>

<style>
</style>
