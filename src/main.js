import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './assets/iconfont/iconfont.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  data() {
    return {
      isloading: false
    }
  }
}).$mount('#app')