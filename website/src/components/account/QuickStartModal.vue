<template>
  <b-modal
    id="QuickStartModal"
    ref="QuickStartModal"
    centered
    :lazy="true"
    hide-footer
    :title="modalTitle"
    :no-close-on-backdrop="noCloseOnBackdrop"
    :no-close-on-esc="noCloseOnEsc"
    :hide-header-close="hideHeaderClose">

    <form @submit.prevent="submit">
      <b-input-group>
        <b-form-input v-model.trim="login" id="login" placeholder="Enter a name or email"></b-form-input>
        <b-input-group-append>
          <b-btn type="submit" variant="outline-success" :disabled="login === ''">{{ submitBtnText }}</b-btn>
        </b-input-group-append>
      </b-input-group>
    </form>

    <!-- TODO: OAuth logic begin -->
    <!-- TODO: OAuth logic end -->
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';

export default Vue.extend({

  data() {
    return {
      modalTitle: "Quick start",
      noCloseOnBackdrop: false,
      noCloseOnEsc: false,
      hideHeaderClose: false,
      submitBtnText: "Starting",
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
    }
  },

  created () {
    if (this.$route.name === "room") {
      this.modalTitle = "Join the room";
      this.noCloseOnBackdrop = true;
      this.noCloseOnEsc = true;
      this.hideHeaderClose = true;
      this.submitBtnText = "Join";
    }
  }
})
</script>
