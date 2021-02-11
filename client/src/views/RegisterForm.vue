<template>
  <div id="login-form">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-card>
          <div slot="header">
            <div slot="header">
              <h2>Реєстрація користувача</h2>
              <el-button
                plain
                icon="el-icon-s-home"
                id="btn-home"
                @click="$router.push('/')"
              >
              </el-button>
            </div>
          </div>
          <el-form
            ref="form"
            :model="form"
            label-width="120px"
            @submit.native.prevent="onSubmit"
          >
            <el-form-item label="Activity name">
              <el-input
                v-model="form.name"
                clearable
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>
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
                Зареєструватися&nbsp;
                <i class="el-icon-s-promotion icon-right"></i>
              </el-button>
              <el-button type="text" icon="el-icon-unlock">Ввійти</el-button>
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
    async onSubmit() {
      let message = ''
      try {
        await this.$store.dispatch('user/register', {
          email: this.form.email,
          password: this.form.password,
          name: this.form.name
        })
        this.$message({
          showClose: true,
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: 'Ви успішно зареєстровані в системі'
        })
      } catch (error) {
        console.log('onSubmit error:', error)
        if (error.type) {
          message = message + `<li>Тип помилки: ${error.type}</li>`
        }
        if (error.status) {
          message = message + `<li>Статус помилки: ${error.status}</li>`
        }
        if (error.message) {
          message = message + `<li>Повідомлення: ${error.message}</li>`
        }
        if (message.length === 0) {
          message = '<li>Невідома помилка</li>'
        }
        this.$message({
          showClose: true,
          type: 'error',
          dangerouslyUseHTMLString: true,
          message
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
h2 {
  margin: 0 auto;
  text-align: center;
  line-height: 2.5rem;
}
.el-card__header > div {
  position: relative;
  height: 2.5rem;
}
#btn-home {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
