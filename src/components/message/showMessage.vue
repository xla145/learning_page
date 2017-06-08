<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right" class="form-style">
    <el-form-item label="编号:" prop="student_id">
      <el-input v-model="form.student_id" readonly="readonly"></el-input>
    </el-form-item>
    <el-form-item label="名字" prop="name">
      <el-input v-model="form.student_name" readonly="readonly"></el-input>
    </el-form-item>
    <el-form-item label="性别：" prop="sex">
      <el-radio-group v-model="form.sex">
        <el-radio :label="0">女</el-radio>
        <el-radio :label="1">男</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="年级" prop="grade_name">
      <el-input v-model="form.grade_name" readonly="readonly"></el-input>
    </el-form-item>
    <el-form-item label="班级" prop="class_name">
      <el-input v-model="form.class_name" readonly="readonly"></el-input>
    </el-form-item>
    <!--<el-form-item label="年级：" prop="grade_name">-->
      <!--<el-select v-model="form.grade_id" placeholder="请选择">-->
        <!--<el-option-->
          <!--v-for="item in grades"-->
          <!--:key="item.id"-->
          <!--:label="item.name"-->
          <!--:value="item.id">-->
        <!--</el-option>-->
      <!--</el-select>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="班级：" prop="class_name">-->
      <!--<el-select v-model="form.class_id" placeholder="请选择">-->
        <!--<el-option-->
          <!--v-for="item in classes"-->
          <!--:key="item.id"-->
          <!--:label="item.name"-->
          <!--:value="item.id">-->
        <!--</el-option>-->
      <!--</el-select>-->
    <!--</el-form-item>-->
    <el-form-item label="电话号码：" prop="phone">
      <el-input v-model="form.phone"></el-input>
    </el-form-item>
  </el-form>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">确定</el-button>
    <el-button type="primary" @click="reset">取消</el-button>
  </el-form-item>
</template>

<script>
import bus, {topic} from '../../common/bus.js'
import {objNullToBlank} from '../../common/utils.js'
export default {
  name: 'showMessage',
  mounted: function () {

  },
  data: function () {
    return {
      showForm: false,
      resetForm: {id: '', student_id: '', name: '', class_name: '', grade_name: '', phone: '', sex: '1'},
      form: {},
      rules: {
        grade_id: [
          {type: 'integer', required: true, message: '请输入年级信息', trigger: 'change'}
        ],
        class_id: [
          {type: 'integer', required: true, message: '请输入资讯类型', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    onSubmit: function () {
      this.$refs['form'].validate((valid) => {
        if (!valid) { return false }
        this.$http.post('/manage/user/updateUser', this.form, {showLoading: true}).then((response) => {
          this.showForm = false
          this.$message({type: 'success', message: '修改用户信息成功'})
        })
      })
    },
    reset: function () {
      // this.$refs['form'].resetFields() // 这个使用时需注意：1.对于form表单未设置prop的属性是不糊被重置的，所以会导致在编辑一条记录后，新增时会看到上条记录的数据，2.也会因为跟dialog一起使用，导致重置失败
      if (this.$refs['form']) { // 重置校验错误
        this.$refs['form'].resetFields()
      }
      this.form = Object.assign({}, this.resetForm)
    },
    getInfo: function () {
      if (sessionStorage.getItem('user') !== null) {
        let user = JSON.parse(sessionStorage.getItem('user'))
        if (user == null) {
          this.$message({type: 'error', message: '获取用户信息失败，请重新刷新页面重新登录'})
          this.$router.push('/login')
        }
        this.$http.post('/manage/user/getInfo', {name: user.name,type: user.type}, {showLoading: true}).then((response) => {
          this.resetForm = Object.assign({},objNullToBlank(response.data))
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
