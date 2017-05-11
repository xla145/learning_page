import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Login = resolve => require(['.././components/Login.vue'], resolve)
const Student = resolve => require(['.././components/index/student/Admin'], resolve)
const Teacher = resolve => require(['.././components/index/teacher/Admin'], resolve)
const Message = resolve => require(['.././components/message/Index'], resolve)
const Record = resolve => require(['.././components/record/Index'], resolve)
const Topic = resolve => require(['.././components/topic/Index'], resolve)
const Answer = resolve => require(['.././components/answer/Index'], resolve)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/manage/student',
      name: 'student',
      component: Student,
      children: [
        { path: '/message', component: Message, name: '个人信息', hidden: true },
        { path: '/topic', component: Topic, name: '讨论管理' },
        { path: '/answer', component: Answer, name: '提问' }
      ]
    },
    {
      path: '/manage/teacher',
      name: 'teacher',
      component: Teacher,
      children: [
        {path: '/message', component: Message, name: '个人信息', hidden: true},
        {path: '/answer', component: Answer, name: '答疑管理'},
        {path: '/record', component: Record, name: '记录管理'}
      ]
    }
  ]
})
