<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <h1>任务</h1>
      <br v-for="i in Array(100)">
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'tasks'
};
</script>
