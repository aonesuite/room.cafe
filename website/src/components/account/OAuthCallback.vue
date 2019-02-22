<template>
  <div class="oauth-actions">
    Sign in...
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import * as UserAPI from '../../api/user';

export default Vue.extend({

  data() {
    return {
      provider: '',
      code: '',
      state: ''
    }
  },

  computed: {
    ...mapState("user", [
      "signedIn"
    ]),

    ...mapState("room", [
      "roomInfo"
    ])
  },

  methods: {
    ...mapActions("user", [
      'fetchState',
      'autoCreateUser'
    ])
  },

  created () {
    this.provider = this.$route.params.provider

    // eslint-disable-next-line
    console.log(this.provider)
    /* eslint-disable */

    // if () {
    //   // UserAPI
    // }
  }
})
</script>
