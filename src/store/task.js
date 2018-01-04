import {axios, throwOnError, objectToFormData} from './transport';
import Vue from 'vue';
import qs from 'qs';

const state = {
  tasks: {}
};

const mutations = {
  updateTask(state, task) {
    Vue.set(state.tasks, task._id, task);
  },
  deleteTask(state, id) {
    Vue.delete(state.tasks, id)
  }
};

const actions = {
  async get({commit}, id) {
    const response = await throwOnError(axios().get('/api/task/' + id));
    commit('updateTask', response);
    return response;
  },
  async find({commit}, query) {
    const headers = {};
    const jwt = window.localStorage.getItem('jwt');
    if (jwt)
      headers.Authorization = 'Bearer ' + jwt;
    const response = await throwOnError(axios().get('/api/task', {
      params: query,
      paramsSerializer: qs.stringify,
      headers
    }));
    for(let task of response.data)
      commit('updateTask', task);
    return response;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
