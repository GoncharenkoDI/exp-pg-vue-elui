import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/ua'
import Vuelidate from 'vuelidate'
import fingerprintPlugin from '@/utils/fingerprint.plugin'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(ElementUI, { locale })

Vue.use(Vuelidate)

Vue.use(fingerprintPlugin)

async function updateUser() {
  if (localStorage.getItem('refreshToken')) {
    console.log(localStorage.getItem('refreshToken'))
    store.commit(
      'auth/setRefreshToken',
      JSON.parse(localStorage.getItem('refreshToken')),
      { root: true }
    )
  } else {
    console.log('no refreshToken')
    return
  }
  try {
    await store.dispatch('auth/refreshToken', null, { root: true })
  } catch (e) {
    console.log(e.message)
  }
}
updateUser()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
