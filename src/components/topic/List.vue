<template>
  <div class="table-list">
    <div class="action">
      <el-button type="primary" size="small" @click="add"><i class="el-icon-plus">&nbsp;添加</i></el-button>
      <el-button type="danger" size="small" @click="deleteRec()">批量删除</el-button>
    </div>
    <el-table :data="tableData" @row-dblclick="edit" border highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" :default-sort="orderInfo" @sort-change="sortChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="title" label="标题" width="200"></el-table-column>
      <el-table-column sortable prop="update_time" label="更新日期" width="180"></el-table-column>
      <el-table-column sortable prop="create_time" label="创建日期" width="180"></el-table-column>
      <el-table-column prop="status" label="状态" width="170" :formatter="fmtstatus" ></el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template scope="scope">
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
    <!--<component :is="editCompName" v-model="showEdit" :editRowId="editRowId"></component>-->
  </div>
</template>

<script>
import bus, {topic} from '../../common/bus.js'
import {localStorageKeys} from '../../common/const.js'

export default {
//  components: {
//  // tableForm: resolve => require(['./AddOrEdit'], resolve) // 必须用下面的方式加载，否则会出现组件加载完成后立即销毁（一闪而过）
//    tableForm: resolve => {
//      require(['./AddOrEdit'], resolve)
//    }
//  },
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
  data: function () {
    let pageSize = localStorage.getItem(localStorageKeys.topicPageSize)
    return {
      editCompName: '', // 用于动态加载编辑组件
      showEdit: false, // 是否展示编辑弹窗
      editRowId: null, // 编辑的记录ID
      pageInfo: {
        pageNum: 1,
        totalRec: 250,
        pageSize: pageSize == null ? 10 : parseInt(pageSize)
      },
      searchData: {},
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
      this.$http.post('/manage/topic/getData', Object.assign({}, this.searchData, this.pageInfo, this.orderInfo)).then((response) => {
        this.pageInfo.totalRec = response.data.totalRow
        this.tableData = response.data.list
      })
    },
    // 设置某条记录可编辑
    edit: function (row) {
      bus.$emit(topic.showAddOrEdit, row.id) // 1：打开弹窗
//      this.editCompName = 'tableForm'
//      this.editRowId = row.id
//      this.showEdit = true
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
        this.$http.post('/manage/topic/delete', Object.assign({}, {topicId: selectIds})).then((response) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(() => { })
    },
    add: function () { // 添加记录
      bus.$emit(topic.showAddOrEdit)// 1：打开弹窗
//      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
//      this.editCompName = 'tableForm'
//      this.editRowId = null
//      this.showEdit = true
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
      if (row.status === 0) {
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
