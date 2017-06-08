<template>
  <el-dialog title="话题管理" v-model="showForm" :close-on-click-modal=false @close="reset" >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right" class="form-style">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="资讯内容" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          placeholder="请输入内容"
          v-model="form.content">
        </el-input>
      </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button type="primary" @click="showForm = false">取消</el-button>
    </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import bus, {topic} from '../../common/bus.js'
import {objNullToBlank} from '../../common/utils.js'

export default {
  name: 'topic-AddOrEdit',
//  props: ['value', 'editRowId'],
  created: function () {
    bus.$on(topic.showAddOrEdit, (id) => { // 监听外部查询数据事件
      this.reset()
      if (id !== undefined) {
        this.getData(id)
      } else {
        this.showForm = true
      }
    })
  },
  data: function () {
    return {
      showForm: false,
      resetForm: {id: '', title: '', content: '', student_id: ''},
      form: {},
      rules: {
        content: [
          {required: true, message: '请输入话题内容', trigger: 'blur'}
        ],
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'},
          {min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    onSubmit: function () {
      this.$refs['form'].validate((valid) => {
        if (!valid) { return false }
        if (sessionStorage.getItem('user') !== null) {
          let user = JSON.parse(sessionStorage.getItem('user'))
          this.form.student_id = user.name
        }
        this.$http.post('/manage/topic/save', this.form, {showLoading: true}).then((response) => {
          this.showForm = false
          if (this.form.id !== '') { // 编辑完成（刷新列表当前页）
            this.$message({type: 'success', message: '编辑数据成功'})
            bus.$emit(topic.refreshListForEdit, this.form)
          } else { // 新增完成（跳到第一页）
            this.$message({type: 'success', message: '添加数据成功'})
            bus.$emit(topic.refreshListForAdd, this.form)
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
    },
    getData: function (id) {
      this.reset()
      this.$http.post('/manage/topic/info', {id: id}).then((response) => {
        this.showForm = true
        this.form = Object.assign({}, this.resetForm, objNullToBlank(response.data))
      })
    }
  }
}
</script>

<style scoped>
</style>
