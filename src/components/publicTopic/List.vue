<template>
  <div class="table-list">
    <el-table :data="tableData" border highlight-current-row style="width: 100%" :default-sort="orderInfo" @sort-change="sortChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="title" label="标题" width="200"></el-table-column>
      <el-table-column prop="content" label="内容" min-width="200"></el-table-column>
      <el-table-column sortable prop="update_time" label="更新日期" width="170"></el-table-column>
      <el-table-column sortable prop="create_time" label="创建日期" width="170"></el-table-column>
      <el-table-column sortable prop="number" label="评论次数" width="170"></el-table-column>
      <el-table-column label="操作" width="200">
        <template scope="scope">
          <el-button @click="stick(scope.row)" type="text" size="small">置顶</el-button>
          <el-button @click="comment(scope.row)" type="text" size="small">评论</el-button>
          <el-button @click="deleteRec([scope.row.id])" type="text" size="small" class="delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.totalRec" class="table-pager">
    </el-pagination>
  </div>
</template>

<script>
import bus, {publicTopic} from '../../common/bus.js'
import {localStorageKeys} from '../../common/const.js'

export default {
  created: function () {
    bus.$on(publicTopic.search, (searchData) => {
      this.search(searchData)
    })
    // 监听外部查询数据事件
    bus.$on(publicTopic.refreshListForEdit, () => { // 监听数据更改后的列表刷新（刷新当前页）
      this.getData()
    })
  },
  data: function () {
    let pageSize = localStorage.getItem(localStorageKeys.publicTopicPageSize)
    return {
      pageInfo: {
        pageNum: 1,
        totalRec: 250,
        pageSize: pageSize == null ? 10 : parseInt(pageSize)
      },
      orderInfo: {prop: 'update_time', order: 'descending'},
      searchData: {},
      tableData: [],
      selectIds: []
    }
  },
  methods: {
    // 点击搜索时执行
    search: function (data) {
      this.resetPageInfo()
      this.searchData = data
      this.getData()
    },
    // 重置分页参数
    resetPageInfo: function () {
      this.pageInfo.totalRec = 0
      this.pageInfo.pageNum = 1
    },
    // 获取服务器数据
    getData: function () {
      this.$http.post('/manage/topic/getAllData', Object.assign({}, this.searchData, this.pageInfo, this.orderInfo)).then((response) => {
        this.pageInfo.totalRec = response.data.totalRow
        this.tableData = response.data.list
      })
    },
    handleSizeChange: function (val) { // 每页条数改变时重新加载记录
      this.pageInfo.pageSize = val
      localStorage.setItem(localStorageKeys.publicTopicPageSize, val)
      this.getData()
    },
    handleCurrentChange: function (val) { // 页码改变时重新加载记录
      this.pageInfo.pageNum = val
      this.getData()
    },
    comment: function (row) {
      bus.$emit(publicTopic.showAddOrEdit, row.id)
    },
    // 删除话题
    deleteRec: function (selectIds) {
      selectIds = selectIds || this.selectIds
      if (selectIds.length === 0) {
        this.$alert('未选择记录', '提示', {confirmButtonText: '确定', closeOnClickModal: true, type: 'warning'})
        return
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
//        console.log(selectIds)
        let user = JSON.parse(sessionStorage.getItem('user'))
        if (user === null) {
          this.$message({type: 'error', message: '获取用户信息失败！'})
        }
        console.log(user.name)
        this.$http.post('/manage/topic/delete', Object.assign({}, {topicId: selectIds, name: user.name})).then((response) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(() => { })
    },
    sortChange: function ({column, prop, order}) { // 排序改变
      console.log(prop)
      if (prop === this.orderInfo.prop && order === this.orderInfo.order) {
        return
      }
      this.orderInfo.prop = prop
      this.orderInfo.order = order
      this.resetPageInfo()
      this.getData()
    },
    stick: function (row) {
      let user
      if (sessionStorage.getItem('user') !== null) {
        user = JSON.parse(sessionStorage.getItem('user'))
      }
      this.$http.post('/manage/topic/stick', Object.assign({}, {topicId: row.id, type: user.type})).then((response) => {
        this.$message({
          type: 'success',
          message: '置顶成功!'
        })
      })
    }
  }
}
</script>

<style scoped>
.table-list{
  border: 1px solid #d7dee7;
  border-radius: 5px;
}
.table-list .el-table{
  border-left: 0px;
}
.table-pager{
  text-align: center;
  padding: 5px 0;
}
.action{
  margin: 10px;
}
</style>
