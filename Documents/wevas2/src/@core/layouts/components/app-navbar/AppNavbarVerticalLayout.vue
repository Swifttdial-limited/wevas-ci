<template>
  <div class="navbar-container d-flex content align-items-center">

    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">

      <!-- Bookmarks Container -->
      <!-- <bookmarks /> -->
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto">
      <span class="mr-2 text-secondary"
      style="text-transform: uppercase; font-weight: bold;"
      >{{ membership.organisation_name }}
      <span class="vl ml-2"></span>
      </span>
      <bulk-account />
      <div v-if="tenantInfo.is_mpesa_enabled">
      <buy-credits />
      </div>
      <dark-Toggler class="d-none d-lg-block" />
      <search-bar />
      <!-- <cart-dropdown />
      <notification-dropdown /> -->
      <user-dropdown />
    </b-navbar-nav>
  </div>
</template>

<script>
import Vue from 'vue'
import { ref } from '@vue/composition-api'
import {
  BLink, BNavbarNav,
} from 'bootstrap-vue'
// import Bookmarks from './components/Bookmarks.vue'
import BulkAccount from './components/BulkAccount.vue'
import SearchBar from './components/SearchBar.vue'
import DarkToggler from './components/DarkToggler.vue'
// import CartDropdown from './components/CartDropdown.vue'
// import NotificationDropdown from './components/NotificationDropdown.vue'
import UserDropdown from './components/UserDropdown.vue'
import BuyCredits from './components/BuyCredits.vue'

export default {
  components: {
    BLink,

    // Navbar Components
    BNavbarNav,
    // Bookmarks,
    BulkAccount,
    SearchBar,
    DarkToggler,
    // CartDropdown,
    // NotificationDropdown,
    UserDropdown,
    BuyCredits,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  setup() {
    const tenantInfo = ref(JSON.parse(JSON.stringify(Vue.$cookies.get('userData').tenantInfo)))
    const membership = ref(JSON.parse(JSON.stringify(Vue.$cookies.get('userData').membership)))
    return {
      tenantInfo,
      membership,
    }
  },
}
</script>
<style scopped>
.vl {
  border-left: 4px solid rgb(221, 216, 207);
  height: 100px;
}
</style>
