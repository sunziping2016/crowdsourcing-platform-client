import {axios, throwOnError, objectToFormData} from './transport';
import Vue from 'vue';
import qs from 'qs';

const state = {
  tasks: {}
};

const mutations = {
  updateTask(state, task) {
    if (typeof task.createdAt === 'string')
      task.createdAt = new Date(task.createdAt);
    if (typeof task.updatedAt === 'string')
      task.updatedAt = new Date(task.updatedAt);
    if (typeof task.deadline === 'string')
      task.deadline = new Date(task.deadline);
    const old = state.tasks[task._id];
    if (old && old.updatedAt.getTime() >= task.updatedAt.getTime())
      return;
    Vue.set(state.tasks, task._id, task);
  },
  deleteTask(state, id) {
    Vue.delete(state.tasks, id);
  }
};

const actions = {
  async get({commit}, id) {
    const headers = {};
    const jwt = window.localStorage.getItem('jwt');
    if (jwt)
      headers.Authorization = 'Bearer ' + jwt;
    const response = await throwOnError(axios().get('/api/task/' + id, {headers}));
    commit('updateTask', response);
    return response;
  },
  async getData({commit}, id) {
    const headers = {};
    const jwt = window.localStorage.getItem('jwt');
    if (jwt)
      headers.Authorization = 'Bearer ' + jwt;
    return await throwOnError(axios().get('/api/task/' + id + '/data', {headers}));
  },
  async find({commit}, query) {
    const response = await throwOnError(axios().get('/api/task', {
      params: query,
      paramsSerializer: qs.stringify
    }));
    if (query.populate)
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
