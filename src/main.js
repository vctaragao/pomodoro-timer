import Vue from 'vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.css'
import 'material-design-icons/iconfont/material-icons.css'

Vue.use(VueCookies);

// set default config
Vue.$cookies.config('7d', '/', '', '', 'Strict')

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
