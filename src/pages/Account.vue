<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3 class="xs-fullscreen-withnav">
        <v-card class="account-card">
          <v-list>
            <v-list-tile class="account-avatar" exact
                         :to="user ? '/account/info' : '/account/login'">
              <v-avatar size="64px">
                <img v-if="avatar" :src="avatar" alt="avatar">
                <icon v-else name="user-circle" scale="4"></icon>
              </v-avatar>
              <v-list-tile-content v-if="!user">
                <v-list-tile-title>登录/注册</v-list-tile-title>
                <v-list-tile-sub-title>登录后即可开始做任务</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content v-else>
                <v-list-tile-title>{{user.username}}</v-list-tile-title>
                <v-list-tile-sub-title>点击查看个人信息</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
        <v-card class="account-card">
          <v-list>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>我的任务</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <span>
                  <small>查看全部任务</small>
                  <v-icon>keyboard_arrow_right</v-icon>
                </span>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile class="account-categorized-tasks">
              <v-btn flat
                     v-for="item in categorizedTasks"
                     :key="item.name"
              >
                <span>{{item.name}}</span>
                <icon :name="item.icon" scale="1.4"></icon>
              </v-btn>
            </v-list-tile>
          </v-list>
        </v-card>
        <v-card class="account-card">
          <v-list>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>我的收藏</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>我的足迹</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>我的分享</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import 'vue-awesome/icons/user-circle';
  import 'vue-awesome/icons/hourglass-o';
  import 'vue-awesome/icons/spinner';
  import 'vue-awesome/icons/check-circle-o';
  import 'vue-awesome/icons/exclamation-triangle';

  export default {
    name: 'account',
    data() {
      return {
        categorizedTasks: [
          {name: '待完成', icon: 'hourglass-o'},
          {name: '待审核', icon: 'spinner'},
          {name: '已通过', icon: 'check-circle-o'},
          {name: '未通过', icon: 'exclamation-triangle'}
        ]
      };
    },
    computed: {
      user() {
        return this.$store.getters['auth/user']
      },
      avatar() {
        return this.$store.getters['auth/avatar'];
      }
    }
  };
</script>

<style lang="stylus">
  .account-card
    margin 16px 0
    .list
      padding 0

  .account-avatar
    height 100px
    .avatar
      margin-right 16px
    .list__tile
      height 100%
    .list__tile__title
      font-size 24px
      line-height 32px
      height 32px
    .list__tile__sub-title
      font-size 16px
      line-height 24px
      height 24px

  .account-categorized-tasks
    height 72px
    padding 8px
    .list__tile
      height 100%
    .btn
      background transparent !important
      border-radius 0
      box-shadow none !important
      height 100%
      margin 0
      max-width 168px
      min-width 80px
      padding 0
      text-transform none
      width 100%
      .btn__content
        flex-direction column-reverse
        color black
</style>
