<template>
  <div id="login-form">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-card>
          <div slot="header">
            <h2>Вхід до програми</h2>
          </div>
          <el-form
            ref="form"
            :model="form"
            label-width="120px"
            @submit.native.prevent="onSubmit"
          >
            <el-form-item label="Email">
              <el-input
                v-model="form.email"
                clearable
                prefix-icon="el-icon-message"
              ></el-input>
            </el-form-item>
            <el-form-item label="Пароль">
              <el-input
                v-model="form.password"
                show-password
                clearable
                prefix-icon="el-icon-key"
              ></el-input>
            </el-form-item>
            <div>
              <el-button type="primary" native-type="submit">
                Ввійти&nbsp;
                <i class="el-icon-s-promotion icon-right"></i
              ></el-button>
              <el-button type="text">Зареєструватися</el-button>
            </div>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data: () => ({
    form: {
      name: '',
      email: '',
      password: ''
    }
  }),
  methods: {
    onSubmit() {
      try {
        this.$store.dispatch('login', {
          email: this.form.email,
          password: this.form.password
        })
      } catch (error) {
        console.log('onSubmit error:', error)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
h2 {
  margin: 0 auto;
  text-align: center;
}
</style>
