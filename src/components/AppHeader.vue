<template>
  <v-toolbar app fixed dark color="primary">
    <v-btn v-if="$route.meta.level !== 0" icon
           @click.native.stop="back">
      <v-icon>arrow_back</v-icon>
    </v-btn>
    <v-toolbar-title class="white--text">
      {{$store.state.appshell.title ||
        $route.meta.title}}
    </v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script>
  export default {
    methods: {
      back() {
        this.$router.back();
      }
    }
  };
</script>

<style lang="stylus">
</style>
