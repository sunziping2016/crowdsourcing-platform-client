<template>
  <v-bottom-nav app color="white"
                :value="$route.meta.level === 0" fixed
                :active.sync="currentTab">
    <v-btn v-for="tab in tabs"
           :key="tab.path"
           flat class="primary--text" :value="tab.route">
      <span>{{tab.text}}</span>
      <v-icon>{{tab.icon}}</v-icon>
    </v-btn>
  </v-bottom-nav>
</template>

<script>
  export default {
    data () {
      return {
        tabs: [
          {text: '任务', icon: 'list', route: 'tasks'},
          {text: '我的', icon: 'account_circle', route: 'account'},
          {text: '更多', icon: 'more_horiz', route: 'more'}
        ],
      };
    },
    computed: {
      currentTab: {
        get() {
          return this.$route.name;
        },
        set(route) {
          this.$router.push({name: route});
        }
      }
    }
  }
</script>
