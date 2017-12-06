const state = {
  title: '',

  snackbar: false,
  snackbarAnimating: false,
  snackbarMessages: [],

  bottomNavigation: true,

  routerTransition: 'slide-y'
};

const mutations = {
  setTitle(state, value) {
    state.title = value || '';
  },
  setBottomNavigation(state,  value) {
    state.bottomNavigation = value;
  },
  setSnackbar(state, value) {
    state.snackbar = value;
  },
  setSnackbarAnimating(state, value) {
    state.snackbarAnimating = value;
  },
  addSnackbarMessage(state, message) {
    if (typeof message !== 'object')
      message = {content: message};
    state.snackbarMessages.push(message);
  },
  popSnackbarMessage(state) {
    state.snackbarMessages.splice(0, 1);
  },
  setRouterTransition(state, transition) {
    state.routerTransition = transition;
  }
};


export default {
  namespaced: true,
  state,
  mutations
};
