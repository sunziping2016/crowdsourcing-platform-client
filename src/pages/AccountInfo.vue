<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex v-if="user"
              xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="account-info-card">
          <v-list>
            <v-list-tile class="account-info-avatar" exact>
              <v-list-tile-content>
                <v-list-tile-title>头像</v-list-tile-title>
              </v-list-tile-content>
              <v-avatar size="64px">
                <img v-if="avatar" :src="avatar" alt="avatar">
                <icon v-else name="user-circle" scale="4"></icon>
              </v-avatar>
            </v-list-tile>
          </v-list>
        </v-card>
        <v-card class="account-info-card">
          <v-list>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>用户名</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-title>{{user.username}}</v-list-tile-title>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>邮箱</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-title>{{user.email}}</v-list-tile-title>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>修改密码</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
        <v-layout justify-center>
          <v-btn class="logout-btn" color="error" large block
                 @click.native="onLogout"
          >退出登录</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import 'vue-awesome/icons/user-circle';

  export default {
    name: 'accountInfo',
    data() {
      return {
        uploading: false
      };
    },
    computed: {
      user() {
        return this.$store.getters['auth/user']
      },
      avatar() {
        return this.$store.getters['auth/avatarThumbnail'];
      }
    },
    methods: {
      onLogout() {
        this.$store.commit('auth/updateToken');
        this.$store.commit('appshell/addSnackbarMessage', '退出登录!');
        this.$router.back();
      }
    }
  };
</script>

<style lang="stylus">
  .account-info-card
    margin-top 16px
    .list
      padding 0

  .account-info-avatar
    height 80px
    .avatar
      margin-right 16px
    .list__tile
      height 100%

  .logout-btn
    margin 16px
</style>
