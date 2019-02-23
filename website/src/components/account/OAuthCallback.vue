<template>
  <div class="oauth-actions">
    Sign in...
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';

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
      'OAuthSignIn'
    ])
  },

  created () {
    this.provider = this.$route.params.provider
    this.state = this.$route.query.state as string
    this.code = this.$route.query.code as string

    const redirect = window.localStorage.getItem("redirect")

    this.OAuthSignIn({
      provider: this.provider,
      state: this.$route.query.state,
      code: this.$route.query.code,
    }).then(() => {
      if (redirect) {
        window.location.href = redirect
      } else {
        this.$router.replace({ name: 'home' })
      }
    })
  }
})
</script>
