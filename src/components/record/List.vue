<template>
  <div class="table-list">
    <div class="action">
      <el-button type="primary" size="small" @click="importData"><i class="el-icon-plus">&nbsp;导出数据</i></el-button>
    </div>
    <el-table :data="tableData" border highlight-current-row style="width: 100%" :default-sort="orderInfo" @sort-change="sortChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="student_id" label="学号" show-overflow-tooltip min-width="180"></el-table-column>
      <el-table-column prop="student_name" label="名字" width="80"></el-table-column>
      <el-table-column prop="sum_times" label="总次数" width="100">
    </el-table-column>
      <el-table-column prop="ask_times" label="提问次数" width="100">
      </el-table-column>
      <el-table-column prop="create_times" label="创建话题次数" width="100">
      </el-table-column>
      <el-table-column prop="reply_times" label="回复次数" width="100">
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
import bus, {record} from '../../common/bus.js'
import {localStorageKeys, serverHost} from '../../common/const.js'

export default {
  created: function () {
    // 监听外部查询数据事件
    bus.$on(record.search, (searchData) => {
      this.search(searchData)
    })
  },
  data: function () {
    let pageSize = localStorage.getItem(localStorageKeys.replyPageSize)
    return {
      isDisabled: false,
      isRead: true,
      pageInfo: {
        pageNum: 1,
        totalRec: 250,
        pageSize: pageSize == null ? 10 : parseInt(pageSize)
      },
      searchData: {
      },
      orderInfo: {prop: 'create_time', order: 'descending'},
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
      this.$http.post('/manage/recordStatistics/getData', Object.assign({}, this.searchData, this.pageInfo, this.orderInfo)).then((response) => {
        this.pageInfo.totalRec = response.data.totalRow
        this.tableData = response.data.list
      })
    },
    handleSizeChange: function (val) { // 每页条数改变时重新加载记录
      this.pageInfo.pageSize = val
      localStorage.setItem(localStorageKeys.replyPageSize, val)
      this.getData()
    },
    handleCurrentChange: function (val) { // 页码改变时重新加载记录
      this.pageInfo.pageNum = val
      this.getData()
    },
    sortChange: function ({column, prop, order}) { // 排序改变
      if (prop === this.orderInfo.prop && order === this.orderInfo.order) {
        return
      }
      this.orderInfo.prop = prop
      this.orderInfo.order = order
      this.resetPageInfo()
      this.getData()
    },
    importData: function () {
      let url = serverHost + '/manage/recordStatistics/importData'
      window.open(url)
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
