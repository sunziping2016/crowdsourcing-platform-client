import {axios, throwOnError, socket} from './transport';
import jwtDecode from 'jwt-decode';

const state = {
  token: null,
  userData: null
};

const mutations = {
  updateToken(state, token) {
    if (token) {
      const data = jwtDecode(token);
      if (!(data.role & 0b1))
        throw new Error('您没有权限登录。');
      state.token = data;
      window.localStorage.setItem('jwt', token);
    } else {
      state.token = null;
      state.userData = null;
      window.localStorage.removeItem('jwt');
    }
  },
  updateUserData(state, userData) {
    state.userData = userData;
  }
};

const actions = {
  async auth({commit}, data) {
    const response = await throwOnError(axios().post('/api/auth/', data)).catch(err => {
      commit('updateToken');
      throw err;
    });
    commit('updateToken', response);
    return response;
  },
  async authAndGetUser({dispatch, state}, data) {
    return dispatch('auth', data).then(() =>
      dispatch('user/get', state.token.uid, {root: true})
    ).then(() =>
      dispatch('getUserData', state.token.uid)
    );
  },
  async getUserData({commit}, id) {
    const headers = {};
    const jwt = window.localStorage.getItem('jwt');
    if (jwt)
      headers.Authorization = 'Bearer ' + jwt;
    const response = await throwOnError(axios().get('/api/user/' + id + '/data', {headers}));
    commit('updateUserData', response);
    return response;
  },
  async setUserData({commit}, data) {
    const id = data.id;
    delete data.id;
    const headers = {};
    const jwt = window.localStorage.getItem('jwt');
    if (jwt)
      headers.Authorization = 'Bearer ' + jwt;
    const response = await throwOnError(axios().post('/api/user/' + id + '/data', data, {headers}));
    commit('updateUserData', data);
    return response;
  }
};

const getters = {
  user(state, getters, rootState) {
    if (state.token)
      return rootState.user.users[state.token.uid];
    return null;
  },
  avatar(state, getters) {
    if (getters.user)
      return getters.user.avatar;
    return null;
  },
  avatarThumbnail(state, getters) {
    if (getters.user)
      return getters.user.avatarThumbnail64;
    return null;
  },
  favorites(state) {
    const result = new Set();
    if (state.userData && state.userData.favorites)
      state.userData.favorites.forEach(x => result.add(x));
    return result;
  },
  history(state) {
    const result = new Set();
    if (state.userData && state.userData.history)
      state.userData.history.forEach(x => result.add(x));
    return result;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
