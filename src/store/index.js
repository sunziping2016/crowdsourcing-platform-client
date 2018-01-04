import Vuex from 'vuex';
import Vue from 'vue';
import appshell from './appshell';
import global from './global';
import auth from './auth';
import user from './user';
import task from './task';
import assignment from './assignment';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    appshell,
    global,
    auth,
    user,
    task,
    assignment
  }
});

export default store;
