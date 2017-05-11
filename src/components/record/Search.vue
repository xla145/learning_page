<template>
  <el-form :model="searchData" ref="formSearch" label-width="80px" class="form-search">
    <el-form-item label="类型" prop="type">
      <el-select v-model="searchData.type" filterable>
        <el-option label="不限" value=""></el-option>
        <el-option v-for="item in types" :key="item.type" :label="item.type_name" :value="item.type"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="游戏" prop="gameId">
      <el-select v-model="searchData.gameId" filterable remote :remote-method="remoteMethod" :loading="loading">
        <el-option label="不限" value=""></el-option>
        <el-option label="无" value="0"></el-option>
        <el-option v-for="item in games" :key="item.gameId" :label="item.gameName" :value="item.gameId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="开始时间" prop="startTime">
      <el-date-picker v-model="searchData.startTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" :editable=false placeholder="创建开始时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间" prop="endTime">
      <el-date-picker v-model="searchData.endTime" type="datetime" :editable=false placeholder="创建结束时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item class="search-action">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import bus, {newsRecommend} from '../../common/bus.js'
import {dateFmt} from '../../common/utils.js'

export default {
  name: 'newsRecommend-search',
  data: function () {
    return {
      searchData: {type: '', gameId: '', startTime: '', endTime: ''},
      gameList: [],
      games: [],
      types: []
    }
  },
  created: function () {
    bus.$on(newsRecommend.refreshListForAdd, () => { // 监听数据添加后的类型数据刷新
      this.getTypes()
    })
  },
  mounted: function () {
    this.getGames()
    this.getTypes()
    this.search()
  },
  methods: {
    getGames: function () { // 获取游戏数据
      this.$http.post('/manage/common/getGames', {}).then((response) => {
        this.gameList = response.data || []
      })
    },
    getTypes: function () {
      this.$http.post('/manage/newsRecommend/getTypes', {}).then((response) => {
        this.types = response.data || []
      })
    },
    search: function () { // 点击搜索
      bus.$emit(newsRecommend.search, Object.assign({}, this.searchData, {startTime: dateFmt(this.searchData.startTime), endTime: dateFmt(this.searchData.endTime)}))
    },
    reset: function () { // 点击重置
      this.$refs['formSearch'].resetFields()
      this.search()
      this.games = []
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
    }
  }
}
</script>

<style scoped>

</style>
