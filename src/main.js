import Vue from 'vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies);

// set default config
Vue.$cookies.config('7d', '/', '', '', 'Strict')

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
