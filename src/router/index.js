import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Login = resolve => require(['.././components/Login.vue'], resolve)
const Student = resolve => require(['.././components/index/student/Admin'], resolve)
const Teacher = resolve => require(['.././components/index/teacher/Admin'], resolve)
const Admin = resolve => require(['.././components/index/admin/Admin'], resolve)
const Record = resolve => require(['.././components/record/Index'], resolve)
const Topic = resolve => require(['.././components/topic/Index'], resolve)
const Answer = resolve => require(['.././components/answer/Index'], resolve)
const Reply = resolve => require(['.././components/reply/Index'], resolve)
const PublicTopic = resolve => require(['.././components/publicTopic/Index'], resolve)
const Message = resolve => require(['.././components/message/Index'], resolve)
const Students = resolve => require(['../components/student/Index'], resolve)
const Teachers = resolve => require(['../components/teacher/Index'], resolve)
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
        { path: 'message', component: Message, name: '修改密码' },
        { path: 'topic', component: Topic, name: '讨论管理' },
        { path: 'answer', component: Answer, name: '提问' },
        { path: 'publicTopic', component: PublicTopic, name: '所有话题' }
      ]
    },
    {
      path: '/manage/teacher',
      name: 'teacher',
      component: Teacher,
      children: [
        { path: 'message', component: Message, name: '修改密码' },
        {path: 'reply', component: Reply, name: '回复管理'},
        {path: 'record', component: Record, name: '记录管理'},
        { path: 'publicTopic', component: PublicTopic, name: '所有话题' }
      ]
    },
    {
      path: '/manage/admin',
      name: 'admin',
      component: Admin,
      children: [
        { path: 'message', component: Message, name: '修改密码' },
        { path: 'student', component: Students, name: '学生管理' },
        { path: 'teacher', component: Teachers, name: '老师管理' }
      ]
    }
  ]
})
