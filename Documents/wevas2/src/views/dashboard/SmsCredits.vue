<template>
  <b-card
    class="card-congratulation-medal"
  >
    <h5>SMS Credits</h5>
    <b-card-text class="font-small-3">
      avaiable SMS Credits
    </b-card-text>
    <h3 class="mb-75 mt-2 pt-50">
      <b-link>10,000</b-link>
    </h3>
    <b-button
      v-ripple.400="'rgba(255, 255, 255, 0.15)'"
      variant="primary"
    >
      View Account
    </b-button>
  </b-card>
</template>

<script>
import {
  BCard, BCardText, BLink, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    BCard,
    BCardText,
    BLink,
    BButton,
  },
  directives: {
    Ripple,
  },
}
</script>
