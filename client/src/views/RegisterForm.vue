<template>
  <div id="register-form-div">
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
            ref="register-form"
            status-icon
            :model="form"
            label-width="10rem"
            @submit.native.prevent="onSubmit"
            :disabled="httpLoading"
            :rules="rules"
          >
            <el-form-item label="Activity name" prop="name">
              <el-input
                v-model="form.name"
                clearable
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input
                v-model="form.email"
                clearable
                prefix-icon="el-icon-message"
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
            <el-form-item label="Підтвердження пароля" prop="confirmPassword">
              <el-input
                v-model="form.confirmPassword"
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
  name: 'RegisterForm',
  data() {
    const checkConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Введіть пароль ще раз.'))
      } else if (value !== this.form.password) {
        callback(new Error('Введені значення не співпадають.'))
      } else {
        callback()
      }
    }
    const isUniqueEmail = async (rule, value, callback) => {
      const check = await this.isUnique(value)
      if (check) {
        callback()
      } else {
        callback(new Error('Користувач з такою адресою вже зареєстрований.'))
      }
    }
    return {
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        name: [
          { required: true, message: "Введіть Ваше ім'я.", trigger: 'blur' }
        ],
        email: [
          {
            required: true,
            message: 'Введіть особисту email адресу.',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: 'Введіть коректну email адресу',
            trigger: ['blur', 'change']
          },
          {
            validator: isUniqueEmail,
            trigger: ['blur']
          }
        ],
        password: [
          { required: true, message: 'Введіть пароль.', trigger: 'blur' }
        ],
        confirmPassword: [
          {
            validator: checkConfirmPassword,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    httpLoading() {
      return this.$store.state.http.loading
    }
  },
  methods: {
    async isUnique(email) {
      if (email === '') return true
      const response = Boolean(
        await this.$store.dispatch('user/testUserByEmail', { email })
      )
      return !response
    },
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
        if (!error.sender) {
          console.log('onSubmit error:', error)
          error.sender = 'client'
        }
        if (!error.source) {
          error.source = 'store user register'
        }
        if (error.sender) {
          message = message + `<li>Відправник помилки: ${error.sender}</li>`
        }
        if (error.source) {
          message = message + `<li>Джерело помилки: ${error.source}</li>`
        }
        if (error.message) {
          message = message + `<li>Повідомлення: ${error.message}</li>`
        }
        if (message.length === 0) {
          message = '<li>Повідомлення: Невідома помилка</li>'
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
