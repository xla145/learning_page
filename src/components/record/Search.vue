<template>
  <el-form :model="searchData" ref="formSearch" label-width="80px" class="form-search">
    <el-form-item label="名字" prop="student_name">
      <el-input v-model="searchData.student_name"></el-input>
    </el-form-item>
    <el-form-item class="search-action">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import bus, {record} from '../../common/bus.js'

export default {
  name: 'answer-search',
  data: function () {
    return {
      searchData: {student_name: ''}
    }
  },
  mounted: function () {
    this.search()
  },
  methods: {
    search: function () { // 点击搜索
      bus.$emit(record.search, Object.assign({}, this.searchData))
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
