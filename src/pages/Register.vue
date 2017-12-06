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
              type="password"
              v-model="password"
              @keyup.native.enter="onRegister"
              :error-messages="passwordError ? [passwordError] : []"
              required
            ></v-text-field>
            <v-text-field
              label="请再次输入密码"
              type="password"
              v-model="retypePassword"
              @keyup.native.enter="onRegister"
              :error-messages="retypePasswordError ? [retypePasswordError] : []"
              required
            ></v-text-field>
            <p>我们没有条款好给你阅读并同意</p>
            <v-layout justify-center>
              <v-btn class="login-btn" color="primary" large block
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
      retypePassword: '',
      retypePasswordError: null,
      verifying: false
    }
  },
  computed: {
    formValid() {
      return !this.verifying && this.username && this.password &&
        !this.usernameError && !this.passwordError;
    }
  },
  methods: {
    onRegister() {
      if (!this.formValid)
        return;
    }
  }
};
</script>

<style lang="stylus" scoped>
  .link-text
    text-align center
    margin-top 16px
</style>
