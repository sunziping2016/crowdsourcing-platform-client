<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex v-if="user" class="xs-fullscreen"
              xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="account-info-card">
          <v-list>
            <v-list-tile class="account-info-avatar" @click="onClickAvatar">
              <v-list-tile-content>
                <v-list-tile-title>头像</v-list-tile-title>
              </v-list-tile-content>
              <div class="avatar-uploading" v-if="uploading">
                <v-progress-circular indeterminate>
                </v-progress-circular>
              </div>
              <v-list-tile-action v-else-if="!avatar" class="blue--text text--darken-2">
                <v-list-tile-title>未设置</v-list-tile-title>
              </v-list-tile-action>
              <v-avatar size="64px" v-else>
                <img :src="avatar" alt="avatar">
              </v-avatar>
              <input ref="avatar-input" type="file"
                     accept="image/png,image/gif,image/jpeg"
                     @change="onUpdateAvatar">
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
            <v-list-tile exact to="/account/password">
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
      <v-flex v-else class="pa-2">
        <v-layout justify-space-around>
          <v-progress-circular indeterminate>
          </v-progress-circular>
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
        return this.$store.getters['auth/avatar'];
      }
    },
    methods: {
      onLogout() {
        this.$store.commit('auth/updateToken');
        this.$store.commit('appshell/addSnackbarMessage', '退出登录!');
        this.$router.back();
      },
      onClickAvatar() {
        if (this.uploading)
          return;
        this.$refs['avatar-input'].click();
      },
      onUpdateAvatar() {
        const file = this.$refs['avatar-input'].files[0];
        if (!file)
          return;
        if (['image/gif', 'image/jpeg', 'image/png'].indexOf(file.type) === -1) {
          this.$store.commit('appshell/addSnackbarMessage', '未知的图片格式!');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          this.$store.commit('appshell/addSnackbarMessage', '图片大小必须小于5M!');
          return;
        }
        this.uploading = true;
        this.$store.dispatch('user/patch', {
          id: this.user._id,
          avatar: file
        }).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        }).then(() => this.uploading = false);
      }
    }
  };
</script>

<style lang="stylus">
  .account-info-card
    margin 16px 0
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


<style lang="stylus" scoped>
  input[type=file]
    display none

  .avatar-uploading
    justify-content center
    width 64px
    display inline-flex
    margin-right 16px
</style>
