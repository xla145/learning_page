<template>
  <el-dialog title="回复管理" v-model="showForm" :close-on-click-modal=false @close="reset">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right" class="form-style">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="提问内容" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          placeholder="请输入内容"
          v-model="form.content" disabled="disabled">
        </el-input>
      </el-form-item>
      <el-form-item label="回复" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          placeholder="请输入内容"
          v-model="form.explanation">
        </el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择类型">
          <el-option label="唯一性" value="1"></el-option>
          <el-option label="普遍性" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button type="primary" @click="showForm = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import bus, {reply} from '../../common/bus.js'
import {objNullToBlank} from '../../common/utils.js'

export default {
  name: 'answerAddOrEdit',
  created: function () {
    // 监听外部查询数据事件
    bus.$on(reply.showAddOrEdit, (id) => {
      this.reset()
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
      resetForm: {id: '', title: '', content: '', teacher_name: '', type: '1', explanation: ''},
      form: {},
      rules: {
        content: [
          {required: true, message: '请输入话题内容', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    getData: function (id) {
      this.$http.post('/manage/answer/info', {id: id}).then((response) => {
        this.showForm = true
        this.form = Object.assign({}, this.resetForm, objNullToBlank(response.data), {type: response.data.type + ''})
      })
    },
    onSubmit: function () {
      this.$refs['form'].validate((valid) => {
        if (!valid) { return false }
        if (sessionStorage.getItem('user') !== null) {
          let user = JSON.parse(sessionStorage.getItem('user'))
          this.form.teacher_name = user.name
        }
        this.$http.post('/manage/answer/deply', this.form, {showLoading: true}).then((response) => {
          this.showForm = false
          if (this.form.id !== '') { // 编辑完成（刷新列表当前页）
            this.$message({type: 'success', message: '编辑数据成功'})
            bus.$emit(reply.refreshListForEdit, this.form)
          } else { // 新增完成（跳到第一页）
            this.$message({type: 'success', message: '添加数据成功'})
            bus.$emit(reply.refreshListForAdd, this.form)
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
