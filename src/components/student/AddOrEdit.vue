<template>
  <el-dialog title="学生管理" v-model="showForm" :close-on-click-modal=false @close="reset">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right" class="form-style">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="学号" prop="student_id">
        <el-input v-model="form.student_id"></el-input>
      </el-form-item>
      <el-form-item label="年级" prop="grade_name">
        <el-input v-model="form.grade_name"></el-input>
      </el-form-item>
      <el-form-item label="班级" prop="class_name">
        <el-input v-model="form.class_name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button type="primary" @click="showForm = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import bus, {student} from '../../common/bus.js'
import {objNullToBlank} from '../../common/utils.js'

export default {
  name: 'answerAddOrEdit',
  created: function () {
    // 监听外部查询数据事件
    bus.$on(student.showAddOrEdit, (id) => {
      this.reset()
      console.log(this.form)
      // this.showForm = true // 此处必须先打开弹窗，如果打开后显示的话，会影响form的重置功能
      if (id !== undefined) {
//        this.title = '编辑话题'
        this.getData(id)
      } else {
//        this.title = '添加话题'
        this.showForm = true
      }
    })
  },
  mounted: function () {
  },
  data: function () {
    return {
      showForm: false,
//      title: '',
      resetForm: {id: '', name: '', class_name: '', phone: '', sex: 1, grade_name: '', student_id: ''},
      form: {sex: '1'},
      rules: {
        name: [
          {required: true, message: '请输入名字', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'}
        ],
        grade_name: [
          {required: true, message: '请输入年级名称', trigger: 'blur'}
        ],
        class_name: [
          {required: true, message: '请输入班级名称', trigger: 'blur'}
        ],
        student_id: [
          {required: true, message: '请输入学号', trigger: 'blur'},
          {min: 12, max: 12, message: '长度是12个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    getData: function (id) {
      this.$http.post('/manage/student/info', {id: id}).then((response) => {
        this.showForm = true
        this.form = Object.assign({}, this.resetForm, objNullToBlank(response.data))
      })
    },
    onSubmit: function () {
      this.$refs['form'].validate((valid) => {
        if (!valid) { return false }
        this.$http.post('/manage/student/save', this.form, {showLoading: true}).then((response) => {
          this.showForm = false
          if (this.form.id !== '') { // 编辑完成（刷新列表当前页）
            this.$message({type: 'success', message: '编辑数据成功'})
            bus.$emit(student.refreshListForEdit, this.form)
          } else { // 新增完成（跳到第一页）
            this.$message({type: 'success', message: '添加数据成功'})
            bus.$emit(student.refreshListForAdd, this.form)
          }
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
</style>
