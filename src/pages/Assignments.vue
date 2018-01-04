<template>
  <v-container class="xs-fullscreen-withnav xs-pa-0" v-scroll="{callback: onScroll}">
    <v-layout column>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="ma-2" v-for="assignment in populatedAssignments"
                v-if="assignment"
                exact :to="'/assignment/' + assignment._id"
                :key="assignment._id"
        >
          <v-card-title class="xs-pa-1">
            <div>
              <h3>{{assignment.summary}}</h3>
              <v-icon>hourglass_empty</v-icon><span>{{['待完成', '待审核', '已通过', '未通过'][assignment.status]}}</span>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat exact :to="'/task/' + assignment.task">前往任务</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex class="pa-2" ref="loader">
        <v-layout justify-space-around>
          <v-progress-circular v-if="!finished" indeterminate>
          </v-progress-circular>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  const fetchLimit = 5;

  export default {
    name: 'assignments',
    data() {
      return {
        assignments: [],
        total: null,
        lastId: null,
        finished: false,
        loading: false
      };
    },
    computed: {
      populatedAssignments() {
        return this.assignments.map(id => this.$store.state.assignment.assignments[id]);
      },
      user() {
        return this.$store.getters['auth/user'];
      }
    },
    watch: {
      $route() {
        this.fetchData(true);
      },
      user() {
        if (this.user)
          this.fetchData(true);
      }
    },
    methods: {
      isEndOfPage() {
        return document.body.offsetHeight + window.scrollY +
          this.$refs.loader.scrollHeight > document.body.scrollHeight;
      },
      fetchData(isFirstQuery) {
        if (isFirstQuery) {
          this.assignments = [];
          this.lastId = null;
          this.finished = false;
          this.total = true;
        }
        const query = {
          populate: true,
          limit: fetchLimit,
          filter: {
            subscriber: this.user._id
          }
        };
        if (isFirstQuery)
          query.count = true;
        else
          query.lastId = this.lastId;
        if (this.$route.query.search)
          query.filter.search = this.$route.query.search;
        if (this.$route.query.status)
          query.filter.status = this.$route.query.status;
        this.loading = true;
        this.$store.dispatch('assignment/find', query).then(response => {
          if (isFirstQuery)
            this.total = response.total;
          this.assignments = this.assignments.concat(response.data.map(item => item._id));
          if (response.data.length < fetchLimit)
            this.finished = true;
          else {
            this.lastId = response.lastId;
            this.$nextTick(() => {
              if (this.isEndOfPage())
                this.fetchData();
            });
          }
        }).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        }).then(() =>
          this.loading = false
        );
      },
      onScroll() {
        if (!this.loading && !this.finished && this.isEndOfPage())
          this.fetchData();
      }
    },
    mounted() {
      if (this.user)
        this.fetchData(true);
    }
  }
</script>
