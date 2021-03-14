<template>
  <div id="login-form-div">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-card>
          <div slot="header">
            <h2>Вхід до програми</h2>
            <el-button
              plain
              icon="el-icon-s-home"
              id="btn-home"
              @click="$router.push('/')"
            >
            </el-button>
          </div>
          <el-form
            ref="login-form"
            status-icon
            :model="form"
            label-width="10rem"
            @submit.native.prevent="onSubmit"
            :rules="rules"
          >
            <el-form-item label="Email" prop="email">
              <el-input
                v-model="form.email"
                clearable
                prefix-icon="el-icon-message"
                autocomplete="on"
                name="email"
              ></el-input>
            </el-form-item>
            <el-form-item label="Пароль" prop="password">
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
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          {
            required: true,
            message: 'Введіть особисту email адресу.',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: 'Введіть коректну email адресу',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: 'Введіть пароль.', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async onSubmit() {
      let message = ''
      let isValidate
      try {
        try {
          await this.$refs['login-form'].validate()
          isValidate = true
        } catch (error) {
          isValidate = false
        }
        await this.$store.dispatch(
          'auth/login',
          {
            email: this.form.email,
            password: this.form.password
          },
          { root: true }
        )
        await this.$store.dispatch('auth/getCurrentUser', null, { root: true })
        this.$message({
          showClose: true,
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: 'Ви успішно ввійшли в систему'
        })
        this.form.email = ''
        this.form.password = ''
        this.$router.push('/')
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
