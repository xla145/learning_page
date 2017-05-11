<template>
  <div>
    <table-search></table-search>
    <table-list></table-list>
    <add-or-edit></add-or-edit>
  </div>
</template>

<script>
import tableSearch from './Search'
import tableList from './List'
import addOrEdit from './AddOrEdit'

export default {
  name: 'topic',
  components: {
    tableSearch,
    tableList,
    addOrEdit
  }
}
</script>

<style scoped>

</style>
