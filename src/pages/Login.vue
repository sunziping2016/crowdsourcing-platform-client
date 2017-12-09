<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-card-text class="pa-4">
            <v-text-field
              label="用户名或邮箱"
              type="text"
              v-model="username"
              @keyup.native.enter="onLogin"
              :error-messages="usernameError ? [usernameError] : []"
              required
            ></v-text-field>
            <v-text-field
              label="密码"
              v-model="password"
              @keyup.native.enter="onLogin"
              :append-icon="passwordVisible ? 'visibility_off' : 'visibility'"
              :append-icon-cb="togglePasswordVisible"
              :type="passwordVisible ? 'text' : 'password'"
              :error-messages="passwordError ? [passwordError] : []"
              required
            ></v-text-field>
            <v-layout justify-center>
              <v-btn color="primary" large block
                     :disabled="!formValid"
                     :loading="verifying"
                     @click.native="onLogin"
              >登录</v-btn>
            </v-layout>
            <p class="link-text">
              <router-link to="register" replace>还没有注册账号？</router-link>
            </p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  const usernameRegex = /^((([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})|[a-z_0-9]+)$/i;

  export default {
    name: 'login',
    data() {
      return {
        username: '',
        usernameError: null,
        password: '',
        passwordError: null,
        passwordVisible: false,
        verifying: false
      }
    },
    computed: {
      formValid() {
        return !this.verifying && this.username && this.password &&
          !this.usernameError && !this.passwordError;
      }
    },
    watch: {
      username() {
        if (this.username.length === 0)
          this.usernameError = '用户名不能为空';
        else if (!usernameRegex.test(this.username))
          this.usernameError = '非法的用户名或邮箱';
        else
          this.usernameError =  null;
      },
      password() {
        if (this.password.length === 0)
          this.passwordError = '密码不能为空';
        else if (this.password.length < 8)
          this.passwordError = '密码长度至少8位';
        else
          this.passwordError = null;
      }
    },
    methods: {
      onLogin() {
        if (!this.formValid)
          return;
        this.verifying = true;
        const data = {payload: {password: this.password}};
        if (this.username.indexOf('@') === -1) {
          // Username
          data.strategy = 'username';
          data.payload.username = this.username;
        } else {
          // Email
          data.strategy = 'email';
          data.payload.email = this.username;
        }
        this.$store.dispatch('auth/authAndGetUser', data).then(() => {
          this.$store.commit('appshell/addSnackbarMessage', '登录成功！');
          this.$router.back();
        }).catch(err => {
          switch (err.message) {
            case 'User does not exist':
              this.usernameError = '用户不存在';
              break;
            case 'Wrong password':
              this.passwordError = '密码错误';
              break;
            default:
              console.error(err);
              this.$store.commit('appshell/addSnackbarMessage', err.message);
          }
        }).then(() => {
          this.verifying = false;
        });
      },
      togglePasswordVisible() {
        this.passwordVisible = !this.passwordVisible;
      },
    }
  };
</script>

<style lang="stylus" scoped>
  .link-text
    text-align center
    margin-top 16px
</style>
