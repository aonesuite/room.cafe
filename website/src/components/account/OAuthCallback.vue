<template>
  <div class="oauth-signin">
    <div class="loading" v-if="oauthSignedFailed === false">
      <b-spinner class="spinner" />
      <Icon class="icon" :type="icon" height="7rem" />
    </div>

    <b-modal
      id="oauthSignInModal"
      ref="oauthSignInModal"
      centered
      :lazy="true"
      :no-close-on-backdrop="true"
      hide-footer
      hide-header
      class="modal-oauth">
      <div class="hint-allow">
        <h5 class="text-center">{{ $t("oauth_signin_failed_hint") }}</h5>

        <div class="oauth-actions">
          <div class="providers">
            <b-btn variant="link" @click="signin('google')">
              <Icon type="google" height="36" />
              <span>Google</span>
            </b-btn>

            <b-btn variant="link" @click="signin('github')">
              <Icon type="github" height="36" />
              <span>GitHub</span>
            </b-btn>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';

import * as UserAPI from '../../api/user';

export default Vue.extend({

  data() {
    return {
      oauthSignedFailed: false,
      icon: '',
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
    ]),

    signin(provider: string) {
      window.localStorage.setItem("redirect", this.$route.path)
      UserAPI.Authorize(provider).then((resp) => {
        window.location.href = resp.data.auth_url
      })
    }
  },

  created () {
    this.provider = this.$route.params.provider
    this.state = this.$route.query.state as string
    this.code = this.$route.query.code as string

    switch (this.provider) {
      case 'github':
        this.icon = 'github'
        break;
      case 'google':
        this.icon = 'google'
        break;
      default:
        break;
    }

    const redirect = window.localStorage.getItem("redirect")

    this.OAuthSignIn({
      provider: this.provider,
      state: this.$route.query.state,
      code: this.$route.query.code,
    })
    .then(() => {
      this.oauthSignedFailed = false
      if (redirect) {
        window.location.href = redirect
      } else {
        this.$router.replace({ name: 'home' })
      }
    })
    .catch(() => {
      this.oauthSignedFailed = true
      this.$root.$emit('bv::show::modal', 'oauthSignInModal');
    })
  }
})
</script>
