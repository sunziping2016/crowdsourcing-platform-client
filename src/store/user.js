import {axios, throwOnError, objectToFormData} from './transport';
import Vue from 'vue';

const state = {
  users: {}
};

const mutations = {
  updateUser(state, user) {
    if (typeof user.createdAt === 'string')
      user.createdAt = new Date(user.createdAt);
    if (typeof user.updatedAt === 'string')
      user.updatedAt = new Date(user.updatedAt);
    const old = state.users[user._id];
    if (old && old.updatedAt.getTime() >= user.updatedAt.getTime())
      return;
    Vue.set(state.users, user._id, user);
  },
  deleteUser(state, id) {
    Vue.delete(state.users, id)
  }
};

const actions = {
  async get({commit}, id) {
    const headers = {};
    const jwt = window.localStorage.getItem('jwt');
    headers.Authorization = 'Bearer ' + jwt;
    const response = await throwOnError(axios().get('/api/user/' + id, {headers}));
    commit('updateUser', response);
    return response;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
