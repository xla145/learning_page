<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right" class="form-style">
    <el-form-item label="原密码:" prop="oldPwd">
      <el-input v-model="form.oldPwd" type="password"></el-input>
    </el-form-item>
    <el-form-item label="新密码:" prop="newPwd">
      <el-input v-model="form.newPwd" type="password"></el-input>
    </el-form-item>
    <el-form-item label="再输一次" prop="checkPass">
      <el-input v-model="form.checkPass" type="password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button type="primary" @click="showForm = false">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import bus, {message} from '../../common/bus.js'

export default {
  name: 'messageAddOrEdit',
  created: function () {
    // 监听外部查询数据事件
    bus.$on(message.showAdd, (id) => {
      this.reset()
      if (id !== undefined) {
        this.getData(id)
      } else {
        this.showForm = true
      }
    })
  },
  mounted: function () {
    this.reset()
  },
  data: function () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    }
    var validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      showForm: false,
      resetForm: {id: '', ordPwd: '', name: '', newPwd: '', checkPass: ''},
      form: {},
      rules: {
        ordPwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPwd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validateCheckPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit: function () {
      this.$refs['form'].validate((valid) => {
        if (!valid) { return false }
        if (sessionStorage.getItem('user') !== null) {
          this.form.name = JSON.parse(sessionStorage.getItem('user')).name
        }
        this.$http.post('/manage/user/updatePwd', this.form, {showLoading: true}).then((response) => {
          this.showForm = false
          this.$message({type: 'success', message: '修改密码成功'})
          this.reset()
        })
      })
    },
    reset: function () {
      // this.$refs['form'].resetFields() // 这个使用时需注意：1.对于form表单未设置prop的属性是不糊被重置的，所以会导致在编辑一条记录后，新增时会看到上条记录的数据，2.也会因为跟dialog一起使用，导致重置失败
      if (this.$refs['form']) { // 重置校验错误
        this.$refs['form'].resetFields()
      }
      this.form = Object.assign({}, this.resetForm)
    }
  }
}
</script>

<style scoped>
  .form-style{width: 600px; margin: 40px;}
</style>
