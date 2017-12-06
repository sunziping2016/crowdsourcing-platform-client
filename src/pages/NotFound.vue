<template>
  <v-container fluid>
    <div class="app-not-found-page">
      <div class="app-not-found-title">
        <div class="not-found-avatar">
          <v-icon class="not-found-avatar-icon">info</v-icon>
        </div>
        <p>页面未找到</p>
      </div>
    </div>
  </v-container>
</template>

<script>
  import {mapActions} from 'vuex';

  export default {
    name: 'notFound'
  };
</script>

<style lang="stylus" scoped>
  .app-not-found-title
    margin-top 50px
    color #666
    font-size 24px
    font-weight bold
    display flex
    flex-direction column
    align-items center

  .not-found-avatar-icon
    width 120px
    height 120px
    font-size 100px

</style>
