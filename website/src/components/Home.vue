<template>
  <div>
    <Navbar />

    <div class="welcome">
      <div class="photograph"></div>
      <div class="hero">
        <div class="section">
          <h1 v-if="!signedIn">{{ $t("slogan") }}</h1>
          <h3 v-if="!signedIn">{{ $t("welcome") }}</h3>

          <h1 v-if="signedIn">{{ $t("sloganSignedIn", { name: user.name }) }}</h1>
          <h3 v-if="signedIn">{{ $t("welcomeSignedIn") }}</h3>

          <div class="feature-actions">
            <ul class="list-inline">
              <li class="list-inline-item">
                <button class="btn btn-outline-primary rounded-circle" @click="quickStart('f2f')">
                  <Icon type="video" width="24" height="24" />
                </button>
                <span>{{ $t("video_call") }}</span>
              </li>

              <li class="list-inline-item">
                <button class="btn btn-outline-primary rounded-circle" @click="quickStart('board')">
                  <Icon type="chalkboard" width="24" height="24" />
                </button>
                <span>{{ $t("board") }}</span>
              </li>

              <li class="list-inline-item">
                <button class="btn btn-outline-primary rounded-circle" @click="quickStart('im')">
                  <Icon type="comment-alt-lines" width="24" height="24" />
                </button>
                <span>{{ $tc("message") }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="features">
      <div class="media">
        <Icon type="video" width="80" class="mt-2 mr-5" />
        <div class="media-body">
          <h2>{{ $t("video_call") }}</h2>
          <ul class="list-unstyled">
            <li v-for="(text, index) in $t('video_call_features')" :key="index">{{ text }}</li>
          </ul>
        </div>
      </div>

      <div class="media">
        <Icon type="chalkboard" width="80" class="mt-2 mr-5" />
        <div class="media-body">
          <h2>{{ $t("board") }}</h2>
          <ul class="list-unstyled">
            <li v-for="(text, index) in $t('board_features')" :key="index">{{ text }}</li>
          </ul>
        </div>
      </div>

      <div class="media">
        <Icon type="comment-alt-lines" width="80" class="mt-2 mr-5" />
        <div class="media-body">
          <h2>{{ $tc("message", 2) }}</h2>
          <ul class="list-unstyled">
            <li v-for="(text, index) in $t('message_features')" :key="index">{{ text }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import Navbar from '../components/partial/Navbar.vue';
import * as RoomAPI from '../api/room';
import { openWindow } from '../utils/window';

export default Vue.extend({

  components: {
    Navbar
  },

  data() {
    return {
      login: ''
    }
  },

  computed: {
    ...mapState("user", [
      "signedIn",
      "user"
    ]),

    ...mapState("room", [
      "roomInfo"
    ])
  },

  methods: {
    ...mapActions("user", [
      'fetchState'
    ]),

    ...mapActions("room", [
      "createRoom"
    ]),

    async quickStart(type: string) {
      await this.fetchState();

      if (this.signedIn) {
        await this.createRoom();
        this.$router.push({ name: "room", params: { id: this.roomInfo.uuid } });
      } else {
        this.$root.$emit('bv::show::modal', 'QuickStartModal');
      }
    }
  },

  created () {

  }
})
</script>
