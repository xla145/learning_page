<template>
  <div class="table-list">
    <div class="action">
      <el-button type="primary" size="small" @click="add"><i class="el-icon-plus">&nbsp;添加</i></el-button>
      <el-button type="danger" size="small" @click="deleteRec()">批量删除</el-button>
    </div>
    <el-table :data="tableData" @row-dblclick="edit" border highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" :default-sort="orderInfo" @sort-change="sortChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="id" label="资讯ID" width="80"></el-table-column>
      <el-table-column fixed prop="title" label="资讯标题" show-overflow-tooltip min-width="200"></el-table-column>
      <el-table-column prop="author" label="作者"  width="100">
      </el-table-column>
      <el-table-column sortable prop="update_time" label="更新日期" width="180"></el-table-column>
      <el-table-column sortable prop="create_time" label="创建日期" width="180"></el-table-column>
      <el-table-column fixed="right" prop="status" label="状态" width="110" :formatter="fmtstatus" ></el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template scope="scope">
          <el-button @click="preview(scope.row)" type="text" size="small">查看所有话题</el-button>
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
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
import bus, {topic} from '../../common/bus.js'
import {localStorageKeys, serverHost} from '../../common/const.js'

export default {
  created: function () {
    // 监听外部查询数据事件
    bus.$on(topic.search, (searchData) => {
      this.search(searchData)
    })
    bus.$on(topic.refreshListForEdit, () => { // 监听数据更改后的列表刷新（刷新当前页）
      this.getData()
    })
    bus.$on(topic.refreshListForAdd, () => { // 监听数据添加后的列表刷新
      this.resetPageInfo()
      this.orderInfo.prop = 'create_time'
      this.orderInfo.order = 'descending'
      this.getData()
    })
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
      this.$http.post('/manage/topic/getData', Object.assign({}, this.searchData, this.pageInfo, this.orderInfo)).then((response) => {
        this.pageInfo.totalRec = response.data.totalRow
        this.tableData = response.data.list
      })
    },
    // 设置某条记录可编辑
    edit: function (row) {
      bus.$emit(topic.showAdd, row.id) // 1：打开弹窗
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
        this.$http.post('/manage/topic/delete', Object.assign({}, {newsId: selectIds})).then((response) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(() => { })
    },
    add: function () { // 添加记录
      bus.$emit(topic.showAdd, '')// 1：打开弹窗
    },
    handleSizeChange: function (val) { // 每页条数改变时重新加载记录
      this.pageInfo.pageSize = val
      localStorage.setItem(localStorageKeys.topicPageSize, val)
      this.getData()
    },
    handleCurrentChange: function (val) { // 页码改变时重新加载记录
      this.pageInfo.pageNum = val
      this.getData()
    },
    handleSelectionChange: function (selectRows) {
      this.selectIds.splice(0, this.selectIds.length) // 清空选择的id
      for (let i = 0; i < selectRows.length; i++) {
        this.selectIds.push(selectRows[i].id)
      }
    },
    fmtstatus: function (row, column) {
      var status
      if (row.status === 10) {
        status = '发布中'
      }
      return status
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
    preview: function (row) {
      window.open(serverHost + '/manage/topic/preview?topicId=' + row.id, '_self')
    }
  },
  data: function () {
    let pageSize = localStorage.getItem(localStorageKeys.messagePageSize)
    return {
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
