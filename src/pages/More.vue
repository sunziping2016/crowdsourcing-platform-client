<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3 class="xs-fullscreen-withnav">
        <v-card class="more-card">
          <v-list>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>消息设置</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile exact to="/more/forget-password">
              <v-list-tile-content>
                <v-list-tile-title>忘记密码</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
        <v-card class="more-card">
          <v-list>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>版本更新</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-title>v0.1.0 alpha</v-list-tile-title>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>新手教程</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>常见问题</v-list-tile-title>
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
  export default {
    name: 'more'
  };
</script>

<style lang="stylus">
  .more-card
    margin 16px 0
    .list
      padding 0
</style>
