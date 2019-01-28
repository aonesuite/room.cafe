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
        <b-nav-item>
          <b-button size="sm" variant="success" type="button">Login</b-button>
        </b-nav-item>
      </b-navbar-nav>

    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
export default class Navbar extends Vue {}
</script>
