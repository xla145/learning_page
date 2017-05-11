<template>
  <div class="table-list">
    <div class="action">
      <el-button type="primary" size="small" @click="add">添加</el-button>
      <el-button type="danger" size="small" @click="deleteRec()">批量删除</el-button>
    </div>
    <el-table :data="tableData" @row-dblclick="edit" @selection-change="selectChange" :default-sort="orderInfo" @sort-change="sortChange" border highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="70"></el-table-column>
      <el-table-column prop="type_name" label="类型" width="100"></el-table-column>
      <el-table-column prop="game_name" label="游戏名称" min-width="120"></el-table-column>
      <el-table-column prop="weight" sortable label="权重" width="100"></el-table-column>
      <el-table-column prop="title" label="标题" show-overflow-tooltip min-width="150"></el-table-column>
      <el-table-column prop="url" label="链接" show-overflow-tooltip min-width="150"></el-table-column>
      <el-table-column prop="update_time" sortable label="更新日期" min-width="130"></el-table-column>
      <el-table-column prop="create_time" sortable label="创建日期" min-width="130"></el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteRec([scope.row.id])" type="text" size="small" class="delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalRec" class="table-pager">
    </el-pagination>
  </div>
</template>

<script>
import bus, {newsRecommend} from '../../common/bus.js'
import {localStorageKeys} from '../../common/const.js'

export default {
  created: function () {
    bus.$on(newsRecommend.search, (searchData) => { // 监听外部查询数据事件
      this.search(searchData)
    })
    bus.$on(newsRecommend.refreshListForEdit, () => { // 监听数据更改后的列表刷新（刷新当前页）
      this.getData()
    })
    bus.$on(newsRecommend.refreshListForAdd, () => { // 监听数据添加后的列表刷新
      this.resetPageInfo()
      this.orderInfo.prop = 'create_time'
      this.orderInfo.order = 'descending'
      this.getData()
    })
  },
  data: function () {
    let pageSize = localStorage.getItem(localStorageKeys.newsRecommendPageSize)
    return {
      pageInfo: {
        pageNum: 1,
        totalRec: 0,
        pageSize: pageSize == null ? 10 : parseInt(pageSize)
      },
      searchData: {},
      orderInfo: {prop: 'create_time', order: 'descending'},
      tableData: [],
      selectIds: []
    }
  },
  methods: {
    search: function (data) { // 点击搜索时执行
      this.resetPageInfo()
      this.searchData = data
      this.getData()
    },
    resetPageInfo: function () { // 重置分页参数
      this.pageInfo.totalRec = 0
      this.pageInfo.pageNum = 1
    },
    getData: function () { // 获取服务器数据
      this.$http.post('/manage/newsRecommend/getData', Object.assign({}, this.searchData, this.pageInfo, this.orderInfo)).then((response) => {
        this.pageInfo.totalRec = response.data.totalRow
        this.tableData = response.data.list
      })
    },
    deleteRec: function (selectIds) { // 删除数据
      selectIds = selectIds || this.selectIds
      if (selectIds.length === 0) {
        this.$alert('未选择记录', '提示', {confirmButtonText: '确定', closeOnClickModal: true, type: 'warning'})
        return
      }
      this.$confirm('确认要删除数据（不可恢复）?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/manage/newsRecommend/delete', {ids: selectIds}).then((response) => {
          this.getData()
        })
      }).catch(() => { })
    },
    edit: function (row) { // 编辑某条记录
      bus.$emit(newsRecommend.showAddOrEdit, row.id)
    },
    add: function () { // 添加记录
      bus.$emit(newsRecommend.showAddOrEdit)
    },
    handleSizeChange: function (val) { // 每页条数改变时重新加载记录
      this.pageInfo.pageSize = val
      localStorage.setItem(localStorageKeys.newsRecommendPageSize, val)
      this.getData()
    },
    handleCurrentChange: function (val) { // 页码改变时重新加载记录
      this.pageInfo.pageNum = val
      this.getData()
    },
    selectChange: function (selectRows) { // 每次选择行时，更新选择的记录ID
      this.selectIds.splice(0, this.selectIds.length) // 清空选择的id
      for (let i = 0; i < selectRows.length; i++) {
        this.selectIds.push(selectRows[i].id)
      }
    },
    sortChange: function ({column, prop, order}) { // 排序改变
      if (prop === this.orderInfo.prop && order === this.orderInfo.order) {
        return
      }
      this.orderInfo.prop = prop
      this.orderInfo.order = order
      this.resetPageInfo()
      this.getData()
    }
  }
}
</script>

<style scoped>
</style>
