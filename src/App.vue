<template>
  <v-app zid="app">
    <app-header></app-header>
    <v-content>
      <div class="outer-frame">
        <transition appear
                    :name="transitionName"
                    :mode="transitionMode"
        >
          <router-view class="inner-frame"
          ></router-view>
        </transition>
      </div>
    </v-content>
    <bottom-navigation></bottom-navigation>
    <app-snackbar></app-snackbar>
  </v-app>
</template>

<script>
  export default {
    computed: {
      transitionName() {
        return this.$store.state.appshell.routerTransition;
      },
      transitionMode() {
        if (this.transitionName === 'slide-y')
          return 'out-in';
        return '';
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .outer-frame
    position relative
    &>.inner-frame
      position absolute
      left 0
      right 0
</style>

<style lang="stylus">
  @import './assets/global'

  html
    overflow-y auto!important
    background-color #fafafa

  input:-webkit-autofill
    -webkit-box-shadow 0 0 0 30px white inset;

  .slide-y
    &-enter-active, &-leave-active
      transition $primary-transition
    &-enter, &-leave-to
      opacity 0
      transform translateY(40px)

  .slide-left
    &-enter-active, &-leave-active
      transition $primary-transition
    &-enter, &-leave-to
      opacity 0
    &-leave-to
      transform translate(-100%, 0)
    &-enter
      transform translate(100%, 0)

  .slide-right
    &-enter-active, &-leave-active
      transition $primary-transition
    &-enter, &-leave-to
      opacity 0
    &-leave-to
      transform translate(100%, 0)
    &-enter
      transform translate(-100%, 0)

  .slide-up
    &-enter-active, &-leave-active
      transition $primary-transition
    &-enter, &-leave-to
      transform translateX(-100%)

  .with-navigation
    padding-bottom 56px

  @media $display-breakpoints.xs-only
    .xs-pa-0
      padding 0
    .xs-pa-1
      padding 8px
    .xs-pa-2
      padding 16px
    .xs-fullscreen
      min-height calc(100vh - 56px)
    .xs-fullscreen-withnav
      min-height calc(100vh - 56px)
      padding-bottom 56px
</style>
