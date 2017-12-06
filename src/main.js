import 'babel-polyfill';
import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App.vue';
import components from './components';
import router from './pages';
import store from './store';
import { sync } from 'vuex-router-sync';

Vue.use(Vuetify, {
  theme: {
    primary: '#7b1fa2',
    accent: '#e040fb',
    secondary: '#424242',
    info: '#2196f3',
    warning: '#ffc107',
    error: '#f44336',
    success: '#4caf50',
  }
});
sync(store, router);
Object.keys(components).forEach(x => Vue.component(x, components[x]));

let app = new Vue({
  router,
  store,
  data: {
    title: '云众包',
  },
  methods: {
    updateTitle() {
      let metaTitle = this.$store.state.route.meta.title;
      if (metaTitle)
        document.title = metaTitle  + ' - ' + this.title;
      else
        document.title = this.title;
    }
  },
  mounted() {
    const jwt = localStorage.getItem('jwt');
    if (jwt)
      store.dispatch('auth/authAndGetUser', {strategy: 'jwt', payload: {jwt}}).catch(err => {
        console.error(err);
        store.commit('appshell/addSnackbarMessage', err.message);
      });
  },
  mixins: [App]
});

store.commit('global/setSite', store.state.global.site);
router.onReady(() => app.$mount('#app'));
