import Vue from 'vue';
import Router from 'vue-router';

const Tasks = () => import('./Tasks.vue');
const Account = () => import('./Account.vue');
const Login = () => import('./Login.vue');
const Register = () => import('./Register.vue');
const AccountInfo = () => import('./AccountInfo.vue');
const NotFound = () => import('./NotFound.vue');
const More = () => import('./More.vue');

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/(index.html)?',
      name: 'tasks',
      component: Tasks,
      meta: {
        title: '任务',
        level: 0,
        tabIndex: 0
      }
    },
    {
      path: '/account',
      name: 'account',
      component: Account,
      meta: {
        title: '我的',
        level: 0,
        tabIndex: 1
      }
    },
    {
      path: '/account/login',
      name: 'login',
      component: Login,
      meta: {
        title: '用户登录',
        level: 1
      }
    },
    {
      path: '/account/register',
      name: 'register',
      component: Register,
      meta: {
        title: '用户注册',
        level: 1
      }
    },
    {
      path: '/account/info',
      name: 'accountInfo',
      component: AccountInfo,
      meta: {
        title: '用户信息',
        level: 1
      }
    },
    {
      path: '/more',
      name: 'more',
      component: More,
      meta: {
        title: '更多',
        level: 0,
        tabIndex: 2
      }
    },
    {
      path: '/404',
      name: 'notFound',
      component: NotFound,
      meta: {
        level: 0
      }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
});

router.beforeEach(function (to, from, next) {
  const $store = router.app.$store,
    fromLevel = from.meta.level,
    toLevel = to.meta.level;
  if ($store) {
    if (fromLevel === toLevel) {
      const fromTabIndex = from.meta.tabIndex,
        toTabIndex = to.meta.tabIndex;
      if (fromTabIndex === undefined || toTabIndex === undefined)
        $store.commit('appshell/setRouterTransition', 'slide-y');
      else if (fromTabIndex < toTabIndex)
        $store.commit('appshell/setRouterTransition', 'slide-left');
      else
        $store.commit('appshell/setRouterTransition', 'slide-right');
    } else if (fromLevel < toLevel)
      $store.commit('appshell/setRouterTransition', 'slide-left');
    else
      $store.commit('appshell/setRouterTransition', 'slide-right');
  }
  next();
});

export default router;
