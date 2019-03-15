<template>
  <b-modal
    id="QuickStartModal"
    ref="QuickStartModal"
    centered
    :lazy="true"
    hide-footer
    :title="$route.name === 'room' ? $t('join_the_room') : $t('quick_start')"
    :no-close-on-backdrop="noCloseOnBackdrop"
    :no-close-on-esc="noCloseOnEsc"
    :hide-header-close="hideHeaderClose">

    <form class="session" @submit.prevent="submit">
      <b-form-group>
        <b-form-input v-model.trim="login" id="login" :placeholder="$t('login_quickly_placeholder')"></b-form-input>
      </b-form-group>

      <div class="actions">
        <!-- <b-btn variant="link" class="px-0 text-success">Create account</b-btn> -->
        <b-btn class="float-right" type="submit" variant="outline-success" :disabled="login === ''">
          {{ $route.name === 'room' ? $t("join") : $t("quick_start") }}
        </b-btn>
      </div>
    </form>

    <div class="oauth-actions">
      <h6>{{ $t("oauth_signin_title") }}</h6>

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
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';

import * as UserAPI from '../../api/user';

export default Vue.extend({

  data() {
    return {
      noCloseOnBackdrop: false,
      noCloseOnEsc: false,
      hideHeaderClose: false,
      login: ''
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
    ]),

    ...mapActions("room", [
      "createRoom"
    ]),

    submit() {
      this.autoCreateUser({ name: this.login }).then(async () => {
        // 如果是在房间中创建用户，则直接调用 Room.vue#joinRoom 方法进入房间
        if (this.$route.name === "room") {
          this.$emit('joinRoom');
        } else {
          await this.createRoom()
          this.$router.push({ name: "room", params: { id: this.roomInfo.uuid } });
        }

        this.$root.$emit('bv::hide::modal', 'QuickStartModal');
      })
    },

    signin(provider: string) {
      window.localStorage.setItem("redirect", this.$route.path)
      UserAPI.Authorize(provider).then((resp) => {
        window.location.href = resp.data.auth_url
      })
    }
  },

  created () {
    if (this.$route.name === "room") {
      this.noCloseOnBackdrop = true;
      this.noCloseOnEsc = true;
      this.hideHeaderClose = true;
    }
  }
})
</script>
