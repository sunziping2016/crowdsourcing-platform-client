<template>
  <v-snackbar v-model="snackbar"
              :timeout="message.timeout || 6000">
    {{ message.content || '' }}
    <v-btn flat
           :class="message.actionClass || 'pink--text'"
           @click.stop="handleClick">
      {{ message.actionText || '关闭' }}
    </v-btn>
  </v-snackbar>
</template>

<script>
  export default {
    data() {
      return {
        transitionTimeout: null
      };
    },
    computed: {
      message() {
        return this.$store.state.appshell.snackbarMessages[0] || {};
      },
      messageLength() {
        return this.$store.state.appshell.snackbarMessages.length;
      },
      snackbar: {
        get() {
          return this.$store.state.appshell.snackbar;
        },
        set(value) {
          if (value !== this.snackbar)
            this.$store.commit('appshell/setSnackbar', value);
        }
      },
      snackbarAnimating: {
        get() {
          return this.$store.state.appshell.snackbarAnimating;
        },
        set(value) {
          if (value !== this.snackbarAnimating)
            this.$store.commit('appshell/setSnackbarAnimating', value);
        }
      }
    },
    methods: {
      handleClick() {
        this.snackbar = false;
        if (this.message.callback)
          this.message.callback();
      },
      updateSnackbar() {
        if (this.messageLength && !this.snackbarAnimating) {
          if (!this.snackbar)
          this.snackbar = !this.snackbar;
        }
      }
    },
    watch: {
      snackbar(value) {
        if (this.transitionTimeout)
          clearTimeout(this.transitionTimeout);
        this.snackbarAnimating = true;
        this.transitionTimeout = setTimeout(() => {
          this.snackbarAnimating = false;
          this.transitionTimeout = null;
        }, 440);
      },
      messageLength(value) {
        if (value) {
          if (!this.snackbarAnimating)
            this.snackbar = !this.snackbar;
        }
      },
      snackbarAnimating(value) {
        if (!value) {
          if (!this.snackbar)
            this.$store.commit('appshell/popSnackbarMessage');
          if (this.messageLength> 1)
            this.snackbar = !this.snackbar;
        }
      }
    }
  };
</script>
