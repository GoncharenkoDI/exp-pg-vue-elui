<template>
  <div id="app">
    <el-container>
      <Aside />
      <el-container>
        <el-header>
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>View</el-dropdown-item>
              <el-dropdown-item>Add</el-dropdown-item>
              <el-dropdown-item>Delete</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>Tom</span>
        </el-header>

        <el-main style="background-color: #545c64">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Aside from './components/Aside'
export default {
  components: { Aside }
}
</script>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
  background-color: #545c64;
}
</style>
