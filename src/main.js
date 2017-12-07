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
    switch (this.$route.query.action) {
      case 'create-user': {
        const token = this.$route.query.token;
        store.dispatch('user/confirmMail', {
          id: token,
          action: 'create-user'
        }).then(() =>
          store.commit('appshell/addSnackbarMessage', '用户创建成功，请重新登录！')
        ).catch(err => {
          switch (err.message) {
            case 'Invalid token':
              store.commit('appshell/addSnackbarMessage', '用户创建失败，无效的凭证！');
              break;
            case 'Username has been taken':
              store.commit('appshell/addSnackbarMessage', '用户创建失败，用户名已被注册！');
              break;
            case 'Email has been taken':
              store.commit('appshell/addSnackbarMessage', '用户创建失败，邮箱已被注册！');
              break;
            default:
              console.error(err);
              store.commit('appshell/addSnackbarMessage', err.message);
          }
        }).then(() => {
          const query = Object.assign({}, this.$route.query);
          delete query.token;
          delete query.action;
          router.replace({
            path: this.$route.path,
            query
          });
        });
        break;
      }
      default: {
        const jwt = localStorage.getItem('jwt');
        if (jwt)
          store.dispatch('auth/authAndGetUser', {strategy: 'jwt', payload: {jwt}}).catch(err => {
            console.error(err);
            store.commit('appshell/addSnackbarMessage', err.message);
          });
      }
    }
  },
  mixins: [App]
});

store.commit('global/setSite', store.state.global.site);
router.onReady(() => app.$mount('#app'));

// Install service-worker
if (navigator.serviceWorker !== undefined && window.location.protocol === 'https:') {
  navigator.serviceWorker.register('/service-worker.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      if (navigator.serviceWorker.controller) {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          switch (newWorker.state) {
            case 'installed':
              app.$store.commit('appshell/addSnackbarMessage', {
                content: '已更新至最新版本, 请刷新页面',
                actionText: '刷新',
                callback() {
                  window.location.reload();
                }
              });
              break;
            case 'redundant':
              throw new Error('The installing service worker became redundant.');
          }
        });
      }
    });
  }).catch(function (e) {
    console.error('Error during service worker registration:', e);
  });
}
