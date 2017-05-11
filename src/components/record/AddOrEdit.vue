<template>
  <el-dialog title="推荐" v-model="showForm" :close-on-click-modal=false @close="reset">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right" class="form-style">
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" @change="typeChange" :disabled="form.id !== ''" filterable placeholder="请选择类型">
          <el-option v-for="item in types" :key="item.type" :label="item.type_name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="游戏" prop="game_id">
        <el-select v-model="form.game_id" @change="gameChange" filterable remote placeholder="请搜索游戏" :remote-method="remoteMethod" :loading="loading">
          <el-option label="无" value="0"></el-option>
          <el-option v-for="item in games" :key="item.gameId" :label="item.gameName" :value="item.gameId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权重" prop="weight">
        <el-input-number v-model="form.weight" :min="1" :max="9999999"></el-input-number>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-autocomplete v-model="form.title" :fetch-suggestions="getNews" @select="titleSelect" placeholder="请填写标题"></el-autocomplete>
      </el-form-item>
      <el-form-item label="链接地址" prop="url">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showForm = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import bus, {newsRecommend} from '../../common/bus.js'
import {objNullToBlank, uniqeByKeys} from '../../common/utils.js'

export default {
  name: 'newsEcommendAddOrEdit',
  created: function () {
    // 监听外部查询数据事件
    bus.$on(newsRecommend.showAddOrEdit, (id) => {
      this.reset()
      // this.showForm = true // 此处必须先打开弹窗，如果打开后显示的话，会影响form的重置功能
      if (id !== undefined) {
        this.getData(id)
      } else {
        this.showForm = true
      }
    })
  },
  mounted: function () {
    this.getGames()
    this.getTypes()
  },
  data: function () {
    return {
      showForm: false,
      loading: false,
      types: [{type: 'index_1', type_name: '首页资讯1'}, {type: 'index_2', type_name: '首页资讯2'}, {type: 'game_1', type_name: '新闻'}, {type: 'game_2', type_name: '指南'}],
      gameList: [],
      games: [],
      // relatedNewsLoading: false,
      relatedNews: [],
      resetForm: {id: '', type: '', type_name: '', game_id: '0', game_name: '首页推荐', weight: '99', url: '', title: ''},
      form: {},
      rules: {
        type: [
          {required: true, message: '请选择类型', trigger: 'blur'}
        ],
        game_id: [
          {type: 'string', required: true, message: '请选择游戏', trigger: 'blur'}
        ],
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'},
          {min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur'}
        ],
        url: [
          {required: true, message: '请输入URL', trigger: 'blur'},
          {type: 'url', message: '必须为URL格式', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    getData: function (id) {
      this.$http.post('/manage/newsRecommend/info', {id: id}).then((response) => {
        this.showForm = true
        this.form = Object.assign({}, this.resetForm, objNullToBlank(response.data))
        this.games = this.getGamesByGameId(response.data.game_id)
      })
    },
    getGames: function () { // 获取游戏数据
      this.$http.post('/manage/common/getGames', {}).then((response) => {
        this.gameList = response.data || []
      })
    },
    getTypes: function () {
      this.$http.post('/manage/newsRecommend/getTypes', {}).then((response) => {
        this.types = uniqeByKeys(this.types.concat(response.data || []))
        // Array.prototype.push.apply(this.types, response.data || [])
      })
    },
    typeChange: function (type) { // 同步type_name
      let selectItem = this.types.filter((item) => {
        return item.type === type
      })
      let thisItem = {type_name: '', type: ''}
      if (selectItem.length > 0) {
        thisItem = selectItem[0]
      }
      this.form.type_name = thisItem.type_name
      this.form.type = thisItem.type
    },
    gameChange: function (id) { // 同步game_name
      let selectItem = this.games.filter((item) => {
        return item.gameId === id
      })
      if (selectItem.length > 0) {
        this.form.game_name = selectItem[0].gameName
        this.form.game_id = selectItem[0].gameId
      }
    },
    getNews: function (query, cb) { // 获取相似资讯
      if (query === '') {
        this.relatedNews = []
        cb(this.relatedNews)
        return
      }
      // this.relatedNewsLoading = true
      this.$http.post('/manage/newsRecommend/getNews', {title: query, limit: 10}).then((response) => {
        this.relatedNews = response.data
        cb(this.relatedNews)
        // this.relatedNewsLoading = false
      })
    },
    titleSelect: function (news) { // 设置url
      this.form.url = news.url
    },
    onSubmit: function () {
      this.$refs['form'].validate((valid) => {
        if (!valid) { return false }
        console.log(this.form.game_id)
        if (this.form.game_id === '0') {
          this.form.game_name = '首页推荐'
        }
        this.$http.post('/manage/newsRecommend/save', this.form, {showLoading: true}).then((response) => {
          this.showForm = false
          if (this.form.id !== '') { // 编辑完成（刷新列表当前页）
            this.$message({type: 'success', message: '编辑数据成功'})
            bus.$emit(newsRecommend.refreshListForEdit, this.form)
          } else { // 新增完成（跳到第一页）
            this.$message({type: 'success', message: '添加数据成功'})
            bus.$emit(newsRecommend.refreshListForAdd, this.form)
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
    remoteMethod: function (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.games = this.gameList.filter(item => {
            return item.gameName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.games = []
      }
    },
    getGamesByGameId: function (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.games = this.gameList.filter(item => {
            return item.gameId.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.games = []
      }
    }
  }
}
</script>

<style scoped>
.el-autocomplete, .el-dropdown{
  width: 100%;
}
</style>
