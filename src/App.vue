<template>
  <div id="app">
    <PortsTable />
  </div>
</template>

<script>
import PortsTable from './components/PortsTable.vue'

export default {
  name: 'App',
  components: {
    PortsTable
  }
}
</script>

<style lang="scss">
  @import "@/scss/_main.scss" 
</style>
