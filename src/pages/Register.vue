<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-card-text class="pa-4">
            <v-text-field
              label="邮箱"
              type="email"
              v-model="email"
              @keyup.native.enter="onRegister"
              :error-messages="emailError? [emailError] : []"
              required
            ></v-text-field>
            <v-text-field
              label="用户名"
              type="text"
              v-model="username"
              @keyup.native.enter="onRegister"
              :error-messages="usernameError ? [usernameError] : []"
              required
            ></v-text-field>
            <v-text-field
              label="密码"
              v-model="password"
              @keyup.native.enter="onRegister"
              :append-icon="passwordVisible ? 'visibility_off' : 'visibility'"
              :append-icon-cb="togglePasswordVisible"
              :type="passwordVisible ? 'text' : 'password'"
              :error-messages="passwordError ? [passwordError] : []"
              required
            ></v-text-field>
            <p>我们将向您的邮箱发送验证邮件，确认后创建您的账户。</p>
            <v-layout justify-center>
              <v-btn color="primary" large block
                     :disabled="!formValid"
                     :loading="verifying"
                     @click.native="onRegister"
              >注册</v-btn>
            </v-layout>
            <p class="link-text">
              <router-link to="login" replace>已经拥有账号？</router-link>
            </p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const usernameRegex = /^[a-z_0-9]+$/i;

  export default {
    name: 'register',
    data() {
      return {
        email: '',
        emailError: null,
        username: '',
        usernameError: null,
        password: '',
        passwordError: null,
        passwordVisible: false,
        verifying: false
      }
    },
    watch: {
      email() {
        if (this.email.length === 0)
          this.emailError = '邮箱不能为空';
        else if (!emailRegex.test(this.email))
          this.emailError = '非法的邮箱';
        else
          this.emailError = null;
      },
      username() {
        if (this.username.length === 0)
          this.usernameError = '用户名不能为空';
        else if (!usernameRegex.test(this.username))
          this.usernameError = '用户名只能有英文、数字和下线符组成';
        else
          this.usernameError = null;
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
    computed: {
      formValid() {
        return !this.verifying && this.username && this.password
          && !this.usernameError && !this.passwordError;
      }
    },
    methods: {
      onRegister() {
        if (!this.formValid)
          return;
        this.verifying = true;
        this.$store.dispatch('user/sendMail', {
          action: 'create-user',
          email: this.email,
          to: '/account',
          username: this.username,
          password: this.password,
          roles: ['SUBSCRIBER']
        }).then(() => {
          this.$store.commit('appshell/addSnackbarMessage', '验证邮件已发送！');
          this.$router.back();
        }).catch(err => {
          switch (err.message) {
            case 'Username has been taken':
              this.usernameError = '用户名已被注册';
              break;
            case 'Email has been taken':
              this.emailError = '邮箱已被注册';
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
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .link-text
    text-align center
    margin-top 16px
</style>
