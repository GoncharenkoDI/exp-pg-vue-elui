<template>
  <el-header height="64px">
    <el-button
      type="text"
      :icon="leftMenuCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
      @click="$emit('leftMenuCollapsed')"
    ></el-button>
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
    >
      <el-menu-item index="/" :route="{ name: 'Home', exact: true }">
        Home
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">Pages</template>
        <el-menu-item index="/test" :route="{ name: 'Test' }">
          Test
        </el-menu-item>
        <el-menu-item index="/about" :route="{ name: 'About' }">
          About
        </el-menu-item>
        <el-menu-item index="/login" :route="{ name: 'Login' }">
          Login
        </el-menu-item>
        <el-menu-item index="/register" :route="{ name: 'Register' }">
          Register
        </el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">item four</template>
          <el-menu-item index="2-4-1">item one</el-menu-item>
          <el-menu-item index="2-4-2">item two</el-menu-item>
          <el-menu-item index="2-4-3">item three</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="3" disabled>Info</el-menu-item>
      <el-menu-item index="4"
        ><a href="https://www.ele.me" target="_blank">Orders</a></el-menu-item
      >
    </el-menu>
  </el-header>
</template>
<script>
export default {
  name: 'Navbar',
  props: {
    leftMenuCollapse: Boolean
  },
  mounted() {},
  data: () => ({
    activeIndex: '/'
  })
}
</script>
<style lang="scss" scoped>
.el-header {
  border-bottom: solid 1px #e6e6e6;
  line-height: 4rem;
  display: flex;
  align-items: center;
}
.el-header h1 {
  padding: 0;
  margin: 0;
}
//  1rem - 16px
.el-button {
  font-size: 2rem;
  margin-right: 1rem;
}
.el-menu.el-menu--horizontal {
  border-bottom: none;
}
</style>
