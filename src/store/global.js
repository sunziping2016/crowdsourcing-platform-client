import {setAxios, setSocket} from './transport';

const state = {
  site: localStorage.getItem('global:site') || window.location.origin,
  enableSocket: localStorage.getItem('global:enableSocket') !== 'false'
};

const mutations = {
  setSite(state, site) {
    state.site = site;
    setAxios(site);
    if (state.enableSocket)
      setSocket(site);
  },
  setEnableSocket(state, value) {
    state.enableSocket = value;
    localStorage.setItem('enableSocket', value);
    if (value)
      setSocket(state.site);
    else
      setSocket(null);
  }
};

export default {
  namespaced: true,
  state,
  mutations
}
