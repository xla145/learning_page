<template>
  <div id ="login">
    <h3 class="title">学习交流与答疑系统</h3>
    <el-form :model="form" :rules="rule" ref="form" label-position="left" label-width="20%" class="demo-ruleForm">
      <el-form-item label="账号" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input type="password" v-model="form.pwd"></el-input>
      </el-form-item>
      <el-form-item label="用户类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="0">学生</el-radio>
          <el-radio :label="1">老师</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')" >登录</el-button>
        <el-button @click="reset('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data: function () {
    return {
      form: {
      },
      resetForm: {
        pwd: '',
        name: '',
        type: 0
      },
      rule: {
        name: [
          {required: true, message: '请输入学号', trigger: 'blur'},
          {min: 12, max: 12, message: '长度是12个字符', trigger: 'blur'}
        ],
        pwd: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur'}
        ]
      }
    }
  },
  mounted: function () {
    this.reset()
  },
  methods: {
    submitForm: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          sessionStorage.setItem('user', JSON.stringify(this.form))
          if (this.form.type === 0) {
            this.$router.push({ path: '/manage/student' })
          } else {
            this.$router.push({ path: '/manage/teacher' })
          }
//          this.$http.post('manage/login', Object.assign({}, this.form))
//            .then((response) => {
//              sessionStorage.setItem('user', JSON.stringify(this.form))
//              if (this.form.type === 0) {
//                this.$router.push({ path: '/student' })
//              } else {
//                this.$router.push({ path: '/teacher' })
//              }
//              let {successCode, data, code, msg} = response.data
//              if (code !== 0 && !successCode) {
//                this.$message({
//                  message: msg,
//                  type: 'error'
//                })
//              this.$router.push('/login')
//             } else {
//                sessionStorage.setItem('user', JSON.stringify(data))
//                if (this.form.type === 0) {
//                  this.$router.push({ path: '/student' })
//                } else {
//                  this.$router.push({ path: '/teacher' })
//                }
//              }
//            })
//            .catch(function (error) {
//              console.log(error)
//            })
        } else {
          return false
        }
      })
    },
    reset: function (formName) { // 点击重置
      console.log(formName)
      if (this.$refs[formName]) { // 重置校验错误
        this.$refs[formName].resetFields()
      }
      try {
        this.form = Object.assign({}, this.resetForm)
      } catch (e) { console.debug(e) }
    }
  }
}
</script>

<style scoped>
  body{background-color: #1b1818;}
  #login{width: 350px;-webkit-border-radius: 5px;background-clip: padding-box;padding: 35px 35px 15px 35px;background-color: #F9FAFC;margin: 180px auto;
    border: 2px solid #8492A6;-moz-border-radius: 5px;margin-bottom: 20px;}
  #login h3{text-align: center;}
</style>
