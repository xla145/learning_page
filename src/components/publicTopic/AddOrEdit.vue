<template>
  <el-dialog title="评论" v-model="showForm" :close-on-click-modal=false @close="reset">
   <article>
     <h2>{{record.title}}</h2>
     <div class="content">{{record.content}}</div>
     <h4>评论内容：</h4>
     <div class="comment">
       <ul v-for="comment in comments">
         <li>
           <span>用户：{{comment.student_name}} </span>
           <p>{{comment.content}}</p>
         </li>
       </ul>
     </div>
   </article>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right" class="form-style">
      <el-form-item label="评论" prop="content">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          placeholder="请输入内容"
          v-model="form.content">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import bus, {publicTopic} from '../../common/bus.js'
import {objNullToBlank} from '../../common/utils.js'

export default {
  name: 'publicTopicAddOrEdit',
  created: function () {
    // 监听外部查询数据事件
    bus.$on(publicTopic.showAddOrEdit, (id) => {
      this.reset()
      if (id !== undefined) {
        this.getData(id)
      }
    })
  },
  data: function () {
    return {
      showForm: false,
      comments: [],
      record: {id: '', title: '', content: ''},
      resetForm: {topic_id: '', content: '', student_id: '', topic_title: ''},
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
    getData: function (id) {
      this.comments = []
      this.$http.post('/manage/record/info', {id: id}).then((response) => {
        this.comments = response.data
      })
      this.$http.post('/manage/topic/info', {id: id}).then((response) => {
        this.showForm = true
        this.record = Object.assign({}, objNullToBlank(response.data))
        this.form = Object.assign({}, this.resetForm, {content: '', topic_id: response.data.id, topic_title: response.data.title, student_id: response.data.student_id, student_name: response.data.student_name})
      })
    },
    onSubmit: function () {
      this.$refs['form'].validate((valid) => {
        if (!valid) { return false }
        if (sessionStorage.getItem('user') !== null) {
          let user = JSON.parse(sessionStorage.getItem('user'))
          this.form.student_id = user.name
        }
        this.$http.post('/manage/record/save', this.form, {showLoading: true}).then((response) => {
          if (this.form.id !== '') { // 编辑完成（刷新列表当前页）
            this.$message({type: 'success', message: '评论成功'})
            this.comments.push({student_name: this.form.student_name, content: this.form.content})
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
  .comment {
    border: 1px solid #dedddd;
    border-radius: 4px;
  }
  .form-style{
    margin-top: 20px;
  }
</style>
