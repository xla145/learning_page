<template>
  <el-form :model="searchData" ref="formSearch" label-width="80px" class="form-search">
    <el-form-item label="标题" prop="title">
      <el-input v-model="searchData.title"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="searchData.status">
        <el-option label="全部" value=''></el-option>
        <el-option label="待答" value="0"></el-option>
        <el-option label="已答" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-select v-model="searchData.type">
        <el-option label="唯一性" value="1"></el-option>
        <el-option label="普遍性" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="search-action">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import bus, {answer} from '../../common/bus.js'

export default {
  name: 'answer-search',
  data: function () {
    return {
      searchData: {title: '', status: '', type: '1', student_id: ''}
    }
  },
  mounted: function () {
    if (sessionStorage.getItem('user') !== null) {
      let user = JSON.parse(sessionStorage.getItem('user'))
      this.searchData.student_id = user.name
    }
    this.search()
  },
  methods: {
    search: function () { // 点击搜索
      bus.$emit(answer.search, Object.assign({}, this.searchData))
    },
    reset: function () { // 点击重置
      this.$refs['formSearch'].resetFields()
      this.search()
    }
  }
}
</script>

<style scoped>

</style>
