<template>
  <v-container class="xs-pa-0">
    <v-layout>
      <v-flex v-if="task"
              xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen taskinfo-card">
          <v-card-media v-if="task.pictureThumbnail" :src="task.pictureThumbnail" height="100px">
            <div class="image-mask"></div>
          </v-card-media>
          <v-card-title class="xs-pa-1">
            <div>
              <h1 class="headline mb-0 taskinfo-title">{{task.name}}</h1>
              <v-chip label v-for="tag in task.tags" :key="tag" class="taskinfo-label">{{tag}}</v-chip>
              <div class="taskinfo-info">
                <p>
                  <span class="label">状态:</span>
                  <span class="value" v-if="task.total && task.total > 0 && task.remain  <= 0">已完成</span>
                  <span class="value" v-else-if="task.deadline && task.deadline.getTime() < Date.now()">已过期</span>
                  <span class="value" v-else>进行中</span>
                </p>
                <p v-if="publisher">
                  <span class="label">发布者:</span>
                  <span class="value">{{publisher.username}}</span>
                </p>
                <p v-if="task.deadline">
                  <span class="label">截止日期:</span>
                  <span class="value">{{formatDate(task.deadline)}}</span>
                </p>
                <p v-if="task.total && task.total > 0">
                  <span class="label">进度:</span>
                  <span class="value">还剩{{task.remain}}/{{task.total}}个作业</span>
                </p>
              </div>
              <article v-if="task" v-html="description" class="taskinfo-description">
              </article>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex v-else class="pa-2">
        <v-layout justify-space-around>
          <v-progress-circular indeterminate>
          </v-progress-circular>
        </v-layout>
      </v-flex>
      <transition name="fade">
        <v-container fluid class="taskinfo-bottom pa-0">
          <v-layout row>
            <v-flex xs4 class="px-1">
              <v-btn block large flat color="grey"
                     @click.native.prevent="like"
                     v-if="!favorites.has($route.params.id)"
              >
                <v-icon>star_border</v-icon>添加收藏
              </v-btn>
              <v-btn block large flat color="orange"
                     @click.native.prevent="dislike"
                     v-else
              >
                <v-icon>star</v-icon>取消收藏
              </v-btn>
            </v-flex>
            <v-flex xs8 class="px-1">
              <v-btn block large class="primary"
                     :disabled="!!buttonStatus.disabled"
                     :loading="taskData === null"
                     @click.native.stop="buttonStatus.handler"
              >{{buttonStatus.text}}</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </transition>
    </v-layout>
  </v-container>
</template>

<script>
  import marked from 'marked';

  export default {
    name: 'task',
    data() {
      return {
        taskData: null
      };
    },
    computed: {
      buttonStatus() {
        if (this.task) {
          switch (this.task.type) {
            case 'guess-number': {
              if (!this.taskData)
                break;
              if (this.taskData.userStatus.blocked)
                return {
                  disabled: true,
                  text: '您已在黑名单中',
                  handler() {}
                };
              else if (this.taskData.userStatus.signing)
                return {
                  disabled: true,
                  text: '报名待审核',
                  handler() {}
                };
              else if (this.taskData.userStatus.created)
                return {
                  disabled: true,
                  text: '已参加过此任务',
                  handler() {}
                };
              else if (this.taskData.userStatus.signed)
                return {
                  text: '参加任务',
                  handler: () => {
                    this.$store.dispatch('assignment/create', {
                      task: this.$route.params.id
                    }).then(response =>
                      this.$router.push('/assignment/' + response._id)
                    ).catch(err => {
                      console.error(err);
                      this.$store.commit('appshell/addSnackbarMessage', err.message);
                    })
                  }
                };
              else
                return {
                  text: '立刻报名',
                  handler: () => {
                    this.$store.dispatch('assignment/create', {
                      task: this.$route.params.id,
                      data: {
                        signup: true
                      }
                    }).then(() =>
                      this.$store.dispatch('task/getData', this.$route.params.id)
                    ).then(response =>
                      this.taskData = response
                    ).catch(err => {
                      console.error(err);
                      this.$store.commit('appshell/addSnackbarMessage', err.message);
                    })
                  }
                };
            }
            default: {
              return {
                disabled: true,
                text: '未知的任务类型',
                handler() {}
              };
            }
          }
        }
        return {
          text: '立刻报名',
          handler() {

          }
        };
      },
      task() {
        return this.$store.state.task.tasks[this.$route.params.id] || null;
      },
      auth() {
        return this.$store.state.auth.token;
      },
      favorites() {
        return this.$store.getters['auth/favorites'];
      },
      history() {
        return this.$store.getters['auth/history'];
      },
      publisher() {
        return (this.task && this.$store.state.user.users[this.task.publisher]) || null;
      },
      description() {
        if (!this.task)
          return null;
        return marked(this.task.description);
      },
      user() {
        return this.$store.getters['auth/user'];
      }
    },
    watch: {
      auth() {
        this.checkGetData();
        this.checkGetUser();
      },
      task() {
        this.checkGetData();
        this.checkGetUser();
      }
    },
    methods: {
      checkGetData() {
        if (this.auth) {
          this.$store.dispatch('task/getData', this.$route.params.id).then(response =>
            this.taskData = response
          ).catch(err => {
            console.error(err);
            this.$store.commit('appshell/addSnackbarMessage', err.message);
          });
        }
      },
      checkGetUser() {
        if (this.auth && this.task && !this.publisher) {
          this.$store.dispatch('user/get', this.task.publisher).catch(err => {
            console.error(err);
            this.$store.commit('appshell/addSnackbarMessage', err.message);
          });
        }
      },
      formatDate(date) {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
      },
      like() {
        if (!this.user)
          this.$store.commit('appshell/addSnackbarMessage', '请先登录');
        else if (this.favorites.size >= 50)
          this.$store.commit('appshell/addSnackbarMessage', '收藏夹已满');
        else {
          const favorites = Array.from(this.favorites);
          favorites.splice(0, 0, this.$route.params.id);
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
      dislike() {
        const favorites = Array.from(this.favorites);
        const index = favorites.indexOf(this.$route.params.id);
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
    },
    mounted() {
      if (!this.task)
        this.$store.dispatch('task/get', this.$route.params.id).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        });
      else {
        this.checkGetData();
        this.checkGetUser();
      }
    }
  };
</script>

<style lang="stylus">
  .taskinfo-label.chip
    height 24px
    margin 2px
    &__content
      padding 0 6px
</style>

<style lang="stylus" scoped>
  .taskinfo-title
    color #dd001e
    font-size 1.8em
    padding 8px 0

  .taskinfo-info
    line-height 1.5em
    p
      margin 3px

    .label
      font-size 1.2em
      color #a2abc3
      display inline-block
      min-width 72px
    .value
      font-size 1.2em
      margin 0 8px
      font-weight 800

  .image-mask
    position absolute
    width 100%
    height 100%
    background url(/static/img/mask.png) repeat

  .taskinfo-description
    margin-top 16px

  .taskinfo-bottom
    background-color #fafafa
    position fixed
    left 0
    bottom 0
    width 100%
    z-index 6
</style>
