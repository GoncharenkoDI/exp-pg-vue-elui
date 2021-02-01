<template>
  <el-container direction="vertical">
    <navbar
      :leftMenuCollapse="leftMenuCollapse"
      @leftMenuCollapsed="leftMenuCollapse = !leftMenuCollapse"
    />
    <el-container>
      <left-menu :isCollapse="leftMenuCollapse" />
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import LeftMenu from '@/components/LeftMenu'
import Navbar from '@/components/Navbar'
export default {
  data: () => ({
    leftMenuCollapse: true
  }),
  components: { LeftMenu, Navbar }
}
</script>

<style lang="scss">
.el-main {
  padding: 1rem;
}
</style>
