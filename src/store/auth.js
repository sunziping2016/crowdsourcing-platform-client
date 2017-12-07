import {axios, throwOnError, socket} from './transport';
import jwtDecode from 'jwt-decode';

const state = {
  token: null
};

const mutations = {
  updateToken(state, token) {
    if (token) {
      window.localStorage.setItem('jwt', token);
      state.token = jwtDecode(token);
    } else {
      window.localStorage.removeItem('jwt');
      state.token = null;
    }
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
    );
  }
};

const getters = {
  user(state, getters, rootState) {
    if (state.token)
      return rootState.user.users[state.token.uid];
    return null;
  },
  avatarThumbnail(state, getters) {
    if (getters.user)
      return getters.user.avatarThumbnail64;
    return null;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
