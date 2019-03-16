<template>
  <b-navbar toggleable="md" fixed="top" type="dark" id="navbar">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand href="/">
      <span>ROOM CAFE</span>
      <img src="@/assets/images/logo.svg" alt="ROOM CAFE" width="24">
    </b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <li class="nav-item">
          <b-button size="sm" variant="success" type="button" @click="quickStart">{{ $t("quick_start") }}</b-button>
        </li>

        <li class="nav-item" v-if="!signedIn">
          <b-button size="sm" variant="success" type="button" @click="quickStart">{{ $t("sign_in") }}</b-button>
        </li>

        <li class="nav-item" id="nav-item-profile" v-if="signedIn">
          <b-button id="profilePopover" variant="link">{{ user.name }}</b-button>
          <b-popover target="profilePopover" triggers="click blur" placement="buttomright" container="nav-item-profile">
            <b-media class="profile-popover-card">
              <b-img
                slot="aside"
                :src="user.avatar"
                :blank="user.avatar == ''"
                blank-color="#CCC"
                width="64"
                height="64"
                class="rounded-circle avatar" />

              <h5 class="mt-0">{{ user.name }}</h5>
              <div class="text-muted">{{ user.email }}</div>
            </b-media>
            <div class="actions">
              <b-btn size="sm" variant="outline-secondary" class="float-right" @click="signOut">Sign out</b-btn>
            </div>
          </b-popover>
        </li>

        <li class="nav-item" id="nav-item-lang">
          <b-button id="lang-switch" variant="link">
            <Icon type="globe" height="18" />
          </b-button>

          <b-popover ref="langSwitchPopover" target="lang-switch" triggers="click blur" placement="buttomright" container="nav-item-lang">
            <div class="list-group">
              <button
                v-for="(label, lang) in langs" :key="lang"
                type="button"
                class="list-group-item list-group-item-action"
                :class="{ active: $i18n.locale === lang}"
                @click="changeLang(lang)">{{label}}</button>
            </div>
          </b-popover>
        </li>
      </b-navbar-nav>
    </b-collapse>

    <QuickStartModal />
  </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import { langs } from '../../locales';
import QuickStartModal from '@/components/account/QuickStartModal.vue';

export default Vue.extend({
  components: {
    QuickStartModal
  },

  data() {
    return {
      langs: langs
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
      'fetchState',
      'Logout'
    ]),

    ...mapActions("room", [
      "createRoom"
    ]),

    async quickStart() {
      await this.fetchState()

      if (this.signedIn) {
        await this.createRoom();
        this.$router.push({ name: "room", params: { id: this.roomInfo.uuid } });
      } else {
        this.$root.$emit('bv::show::modal', 'QuickStartModal');
      }
    },

    changeLang(lang: string) {
      this.$i18n.locale = lang;
      localStorage.setItem("locale", lang);
      if (this.$refs.langSwitchPopover === undefined) return;
      const langSwitchPopover = this.$refs.langSwitchPopover as any;
      langSwitchPopover.$emit('close');
    },

    signOut() {
      this.Logout().then(() => {
        localStorage.removeItem("token");
        this.$router.push({ name: "home" });
      })
    }
  },

  created () {

  }
})
</script>
