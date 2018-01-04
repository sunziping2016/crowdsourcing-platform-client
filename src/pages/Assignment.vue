<template>
  <v-container class="xs-pa-0">
    <v-layout>
      <v-flex v-if="assignment"
              xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen" v-if="assignmentData && !assignmentData.signup">
          <v-card-title>
            <div>
              <p>你可以猜测一个数字，我们会给出其偏大还是偏小。</p>
              <p>{{assignment.summary}}</p>
              <p v-if="assignmentData.compare === 1">偏大</p>
              <p v-else-if="assignmentData.compare === 0">正确</p>
              <p v-else-if="assignmentData.compare === -1">偏小</p>
              <p v-else-if="assignmentData.answer !== undefined">正确答案：{{assignmentData.answer}}</p>
              <v-text-field v-model="number"
                            type="number"
                            label="要猜的数字"
              ></v-text-field>
              <v-btn block large color="primary"
                     @click.native="guess"
                     v-if="!assignmentData.finished"
              >猜测</v-btn>
              <v-btn block large color="primary"
                     @click.native="submit"
                     :disabled="assignment.status !== 0"
                     v-else
              >{{assignment.status === 0 ? '提交' : '已提交'}}</v-btn>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'assignment',
    data() {
      return {
        assignmentData: null,
        number: ''
      };
    },
    computed: {
      assignment() {
        return this.$store.state.assignment.assignments[this.$route.params.id] || null;
      },
      user() {
        return this.$store.getters['auth/user'];
      }
    },
    methods: {
      checkGetAssignment() {
        if (this.user) {
          this.$store.dispatch('assignment/get', this.$route.params.id).catch(err => {
            console.error(err);
            this.$store.commit('appshell/addSnackbarMessage', err.message);
          });
          this.$store.dispatch('assignment/getData', this.$route.params.id).then(response =>
            this.assignmentData = response
          ).catch(err => {
            console.error(err);
            this.$store.commit('appshell/addSnackbarMessage', err.message);
          });
        }
      },
      guess() {
        this.$store.dispatch('assignment/postData', {
          id: this.$route.params.id,
          guess: parseInt(this.number)
        }).then(() =>
          this.$store.dispatch('assignment/getData', this.$route.params.id)
        ).then(response =>
          this.assignmentData = response
        ).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        });
      },
      submit() {
        this.$store.dispatch('assignment/patch', {
          id: this.$route.params.id,
          status: 'SUBMITTED'
        }).then(() => this.$router.back()).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        });
      }
    },
    watch: {
      user() {
        this.checkGetAssignment();
      }
    },
    mounted() {
      this.checkGetAssignment();
    }
  }
</script>
