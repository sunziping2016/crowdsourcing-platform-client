<template>
  <v-container class="xs-fullscreen-withnav xs-pa-0" v-scroll="{callback: onScroll}">
    <v-layout column>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="ma-2" v-for="task in populatedTasks"
                v-if="task"
                exact :to="'/task/' + task._id"
                :key="task._id"
        >
          <v-card-media v-if="task.pictureThumbnail" :src="task.pictureThumbnail" height="140px">
            <v-container fill-height fluid class="pa-2">
              <v-layout fill-height>
                <v-flex xs12 align-end flexbox>
                  <span class="headline task-headline">{{task.name}}</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-media>
          <v-card-title class="xs-pa-1">
            <div>
              <h3 class="headline mb-0" v-if="!task.pictureThumbnail">{{task.name}}</h3>
              <div v-if="task && task.tags && task.tags.length" class="task-info-text">
                <v-icon>label_outline</v-icon>
                <v-chip label v-for="tag in task.tags" :key="tag">{{tag}}</v-chip>
              </div>
              <div v-if="task && task.deadline" class="task-info-text">
                <v-icon>access_time</v-icon>
                {{formatDate(task.deadline)}}
              </div>
              <div v-if="task && task.total && task.total > 0" class="task-info-text">
                <v-icon>hourglass_empty</v-icon>
                还剩{{task.remain}}个作业
              </div>
              <div class="mt-2">{{task.excerption}}</div>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="grey"
                   @click.native.prevent="like(task)"
                   v-if="!favorites.has(task._id)"
            >
              <v-icon>star_border</v-icon>添加收藏
            </v-btn>
            <v-btn flat color="orange"
                   @click.native.prevent="dislike(task)"
                   v-else
            >
              <v-icon>star</v-icon>取消收藏
            </v-btn>
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
    name: 'taskList',
    data() {
      return {
        tasks: [],
        total: null,
        lastId: null,
        finished: false,
        loading: false
      };
    },
    computed: {
      populatedTasks() {
        return this.tasks.map(id => this.$store.state.task.tasks[id]);
      },
      favorites() {
        return this.$store.getters['auth/favorites'];
      },
      history() {
        return this.$store.getters['auth/history'];
      },
      user() {
        return this.$store.getters['auth/user'];
      }
    },
    watch: {
      $route() {
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
          this.tasks = [];
          this.lastId = null;
          this.finished = false;
          this.total = true;
        }
        const query = {
          populate: true,
          limit: fetchLimit,
          filter: {
            status: 'PUBLISHED'
          }
        };
        if (isFirstQuery)
          query.count = true;
        else
          query.lastId = this.lastId;
        if (this.$route.query.search)
          query.filter.search = this.$route.query.search;
        if (this.$route.query.type)
          query.filter.type = this.$route.query.type;
        if (this.$route.query.tag)
          query.filter.tag = this.$route.query.tag;
        this.loading = true;
        this.$store.dispatch('task/find', query).then(response => {
          if (isFirstQuery)
            this.total = response.total;
          this.tasks = this.tasks.concat(response.data.map(item => item._id));
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
      },
      like(task) {
        if (!this.user)
          this.$store.commit('appshell/addSnackbarMessage', '请先登录');
        else if (this.favorites.size >= 50)
          this.$store.commit('appshell/addSnackbarMessage', '收藏夹已满');
        else {
          const favorites = Array.from(this.favorites);
          favorites.splice(0, 0, task._id);
          this.$store.dispatch('auth/setUserData', {
            id: this.user._id,
            favorites,
            history: Array.from(this.history)
          }).catch(err => {
            console.error(err);
            this.$store.commit('appshell/addSnackbarMessage', err.message);
          });
        }
      },
      dislike(task) {
        const favorites = Array.from(this.favorites);
        const index = favorites.indexOf(task._id);
        if (index < 0)
          return;
        favorites.splice(index, 1);
        this.$store.dispatch('auth/setUserData', {
          id: this.user._id,
          favorites,
          history: Array.from(this.history)
        }).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        });
      },
      formatDate(date) {
        if (date.getTime() < Date.now())
          return '已结束';
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
      }
    },
    mounted() {
      this.fetchData(true);
    }
  };
</script>

<style lang="stylus">
  .task-headline
    text-shadow 0 0 5px white
  .task-info-text
    color grey
    .chip
      height 22px
      margin 2px
      &__content
        padding 0 6px
    .icon
      font-size 16px
</style>
