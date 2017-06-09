<template xmlns:v="http://www.w3.org/1999/XSL/Transform">
  <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right" class="form-style">
    <el-form-item label="编号:" prop="student_id">
      <el-input v-model="form.user_id" readonly="readonly"></el-input>
    </el-form-item>
    <el-form-item label="名字" prop="name">
      <el-input v-model="form.name" readonly="readonly"></el-input>
    </el-form-item>
    <el-form-item label="性别：" prop="sex">
      <el-radio-group v-model="form.sex">
        <el-radio :label="0">女</el-radio>
        <el-radio :label="1">男</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="电话号码：" prop="phone">
      <el-input v-model="form.phone"></el-input>
    </el-form-item>
    <el-form-item label="年级" prop="grade_name" v-if="form.type == '0'">
      <el-input v-model="form.grade_name" readonly="readonly"></el-input>
    </el-form-item>
    <el-form-item label="班级" prop="class_name" v-if="form.type == '0'">
      <el-input v-model="form.class_name" readonly="readonly"></el-input>
    </el-form-item>
    <!--<el-form-item label="头像" prop="img">-->
      <!--<el-upload class="pic-uploader"-->
                 <!--:action="_uploadFilePath"-->
                 <!--:show-file-list="false"-->
                 <!--:on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">-->
        <!--<img v-if="form.img" :src="form.img" class="pic-img" @error="imgError">-->
        <!--<i v-else class="el-icon-plus pic-uploader-icon"></i>-->
      <!--</el-upload>-->
    <!--</el-form-item>-->
    <!--<el-form-item>-->
      <!--<el-button type="primary" @click="onSubmit">确定</el-button>-->
      <!--<el-button type="primary" @click="reset">取消</el-button>-->
    <!--</el-form-item>-->
  </el-form>
</template>

<script>
import {objNullToBlank} from '../../common/utils.js'
export default {
  name: 'showMessage',
  mounted: function () {
    this.getInfo()
  },
  data: function () {
    return {
      showForm: false,
      resetForm: {id: '', userId: '', name: '', class_name: '', grade_name: '', phone: '', sex: '1', type: '', img: ''},
      form: {},
      rules: {
        grade_id: [
          {type: 'integer', required: true, message: '请输入年级信息', trigger: 'change'}
        ],
        class_id: [
          {type: 'integer', required: true, message: '请输入班级信息', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    imgError: function () {
      this.form.img = ''
    },
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
      if (this.$refs['form']) { // 重置校验错误
        this.$refs['form'].resetFields()
      }
      try {
        this.form = Object.assign({}, this.resetForm)
      } catch (e) { console.debug(e) }
    },
    getInfo: function () {
      if (sessionStorage.getItem('user') !== null) {
        let user = JSON.parse(sessionStorage.getItem('user'))
        if (user == null) {
          this.$message({type: 'error', message: '获取用户信息失败，请重新刷新页面重新登录'})
          this.$router.push('/login')
        }
        this.$http.post('/manage/user/getInfo', {name: user.name, type: user.type}, {showLoading: true}).then((response) => {
          this.form = Object.assign({}, this.resetForm, objNullToBlank(response.data), {type: user.type, user_id: user.name})
        })
      }
    },
    handleAvatarScucess: function (res, file) {
      if (res) {
        this.form.img = res
      } else {
        this.$message.error('该图片不支持上传，请更换一张！')
      }
    },
    beforeAvatarUpload: function (file) {
      const isRightType = file.type.indexOf('image/') === 0
      const isRightSize = file.size / 1024 / 1024 < 5
      if (!isRightType) {
        this.$message.error('上传文件必须为图片格式!')
      }
      if (!isRightSize) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return isRightSize && isRightType
    }
  }
}
</script>

<style scoped>
  .form-style{width: 500px;margin-left: 10px;margin-top: 10px;}
  .pic-uploader .el-upload{
    border: 1px dashed #bfcbd9;
    border-radius: 6px;
    cursor: pointer;
  }
  .pic-uploader .el-upload:hover{
    border-color: #20a0ff;
  }
  .pic-uploader img{
    width: 350px;
  }
  .pic-uploader-icon{
    padding: 100px 160px;
    font-size: 28px;
  }
</style>
