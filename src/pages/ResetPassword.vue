<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex v-if="user || $route.query.action === 'reset-password'"
              xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-card-text class="pa-4">
            <p>请输入您的新密码，您将被要求重新登录您的账号。</p>
            <v-text-field
              label="密码"
              v-model="password"
              @keyup.native.enter="onConfirm"
              :append-icon="passwordVisible ? 'visibility_off' : 'visibility'"
              :append-icon-cb="togglePasswordVisible"
              :type="passwordVisible ? 'text' : 'password'"
              :error-messages="passwordError ? [passwordError] : []"
            ></v-text-field>
            <v-layout justify-center>
              <v-btn large block color="primary"
                     :disabled="!valid"
                     :loading="verifying"
                     @click="onConfirm">
                确认
              </v-btn>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex class="pa-2" v-else>
        <v-layout justify-space-around>
          <v-progress-circular indeterminate>
          </v-progress-circular>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'resetPassword',
    data() {
      return {
        password: '',
        passwordError: null,
        passwordVisible: false,
        verifying: false
      };
    },
    watch: {
      password() {
        if (this.password.length === 0)
          this.passwordError = '密码不能为空';
        else if (this.password.length < 8)
          this.passwordError = '密码长度至少8位';
        else
          this.passwordError = null;
      }
    },
    computed: {
      user() {
        return this.$store.getters['auth/user']
      },
      valid() {
        return !this.verifying && this.password && !this.passwordError;
      }
    },
    methods: {
      onConfirm() {
        if (!this.valid)
          return;
        this.verifying = true;
        if (this.$route.query.action === 'reset-password') {
          // Forget password
          this.$store.dispatch('user/confirmMail', {
            id: this.$route.query.token,
            action: 'reset-password',
            password: this.password
          }).then(() => {
            this.$store.commit('appshell/addSnackbarMessage', '修改密码成功，请重新登录！');
          }).catch(err => {
            switch (err.message) {
              case 'Invalid token':
                this.$store.commit('appshell/addSnackbarMessage', '修改密码失败，无效的凭证！');
                break;
              case 'User does not exist':
                this.$store.commit('appshell/addSnackbarMessage', '修改密码失败，用户不存在！');
                break;
              default:
                console.error(err);
                this.$store.commit('appshell/addSnackbarMessage', err.message);
            }
          }).then(() => {
            this.$router.replace('/account');
            this.verifying = false;
          });
        } else {
          // Change password
          this.$store.dispatch('user/patch', {
            id: this.user._id,
            password: this.password
          }).then(() => {
            this.$store.commit('auth/updateToken');
            this.$store.commit('appshell/addSnackbarMessage', '请重新登录您的账号！');
            this.$router.go(-2);
          }).catch(err => {
            console.error(err);
            this.$store.commit('appshell/addSnackbarMessage', err.message);
          }).then(() => this.verifying = false);
        }
      },
      togglePasswordVisible() {
        this.passwordVisible = !this.passwordVisible;
      }
    }
  }
</script>
