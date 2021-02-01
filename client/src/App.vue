<template>
  <div id="app">
    <component :is="currentLayout"></component>
  </div>
</template>

<script>
import MainLayout from './views/layouts/MainLayout'
import EmptyLayout from './views/layouts/EmptyLayout'
export default {
  data: () => ({
    currentLayout: 'MainLayout'
  }),
  computed: {
    currentRoute() {
      return this.$route
    }
  },
  watch: {
    currentRoute() {
      const layoutName = this.$route.meta.layout || 'main'
      this.currentLayout = layoutName + '-layout'
      console.log(this.currentLayout)
    }
  },
  components: { MainLayout, EmptyLayout }
}
</script>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
  background-color: #545c64;
  color: white;
}
#app {
  border-bottom: solid 1px #e6e6e6;
}
</style>
