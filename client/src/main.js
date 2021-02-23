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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
