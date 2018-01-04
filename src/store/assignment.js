import {axios, throwOnError} from './transport';
import Vue from 'vue';
import qs from 'qs';

const state = {
  assignments: {}
};

const mutations = {
  updateAssignment(state, assignment) {
    if (typeof assignment.createdAt === 'string')
      assignment.createdAt = new Date(assignment.createdAt);
    if (typeof assignment.updatedAt === 'string')
      assignment.updatedAt = new Date(assignment.updatedAt);
    const old = state.assignments[assignment._id];
    if (old && old.updatedAt.getTime() >= assignment.updatedAt.getTime())
      return;
    Vue.set(state.assignments, assignment._id, assignment);
  },
  deleteAssignment(state, id) {
    Vue.delete(state.assignments, id);
  }
};

const actions = {
  async create({commit}, data) {
    const headers = {};
    const jwt = window.localStorage.getItem('jwt');
    if (jwt)
      headers.Authorization = 'Bearer ' + jwt;
    const response = await throwOnError(axios().post('/api/assignment?populate=true', data, {headers}));
    commit('updateAssignment', response);
    return response;
  },
  async find({commit}, query) {
    const headers = {};
    const jwt = window.localStorage.getItem('jwt');
    if (jwt)
      headers.Authorization = 'Bearer ' + jwt;
    const response = await throwOnError(axios().get('/api/assignment', {
      params: query,
      paramsSerializer: qs.stringify,
      headers
    }));
    if (query.populate)
      for(let assignment of response.data)
        commit('updateAssignment', assignment);
    return response;
  },
  async get({commit}, id) {
    const headers = {};
    const jwt = window.localStorage.getItem('jwt');
    if (jwt)
      headers.Authorization = 'Bearer ' + jwt;
    const response = await throwOnError(axios().get('/api/assignment/' + id, {headers}));
    commit('updateAssignment', response);
    return response;
  },
  async getData({commit}, id) {
    const headers = {};
    const jwt = window.localStorage.getItem('jwt');
    if (jwt)
      headers.Authorization = 'Bearer ' + jwt;
    return await throwOnError(axios().get('/api/assignment/' + id + '/data', {headers}));
  },
  async postData({commit}, data) {
    const headers = {}, id = data.id;
    const jwt = window.localStorage.getItem('jwt');
    if (jwt)
      headers.Authorization = 'Bearer ' + jwt;
    delete data.id;
    return await throwOnError(axios().post('/api/assignment/' + id + '/data', data, {headers}));
  },
  async patch({commit}, data) {
    const headers = {}, id = data.id;
    const jwt = window.localStorage.getItem('jwt');
    if (jwt)
      headers.Authorization = 'Bearer ' + jwt;
    delete data.id;
    return await throwOnError(axios().patch('/api/assignment/' + id, data, {headers}));
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
