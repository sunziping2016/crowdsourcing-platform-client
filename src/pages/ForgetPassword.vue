<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-card-text class="pa-4">
            <p>请输入您的邮箱，我们将向您发送验证邮件。</p>
            <v-text-field
              label="邮箱"
              type="email"
              v-model="email"
              @keyup.native.enter="onConfirm"
              :error-messages="emailError? [emailError] : []"
              required
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
    </v-layout>
  </v-container>
</template>

<script>
  const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  export default {
    name: 'forgetPassword',
    data() {
      return {
        email: '',
        emailError: null,
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
      }
    },
    computed: {
      valid() {
        return !this.verifying && this.email && !this.emailError;
      }
    },
    methods: {
      onConfirm() {
        if (!this.valid)
          return;
        this.verifying = true;
        this.$store.dispatch('user/sendMail', {
          action: 'reset-password',
          email: this.email,
          to: '/account/password',
        }).then(() => {
          this.$store.commit('appshell/addSnackbarMessage', '验证邮件已发送！');
          this.$router.back();
        }).catch(err => {
          switch (err.message) {
            case 'User does not exist':
              this.emailError = '用户不存在';
              break;
            default:
              console.error(err);
              this.$store.commit('appshell/addSnackbarMessage', err.message);
          }
        }).then(() => {
          this.verifying = false;
        });
      }
    }
  }
</script>
