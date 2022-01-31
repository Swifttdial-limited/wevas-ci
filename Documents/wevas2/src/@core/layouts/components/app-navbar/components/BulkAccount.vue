<template>
  <b-nav-item-dropdown
    id="dropdown-grouped"
    variant="link"
    class="dropdown-language"
    right
  >
    <template #button-content>
      <span>
        SMS Credits:
      </span>
      <span class="ml-50 text-body">{{ bulkAccounts.total.toLocaleString() }}</span>
      <span>
        <feather-icon
          size="16"
          icon="ChevronDownIcon"
          class="ml-1"
        />
      </span>
      <span>
      <feather-icon
          size="13"
          icon="RefreshCwIcon"
          class="ml-1 text-primary"
          @click="refreshBulkAccount"
        />
      </span>
    </template>
    <b-dropdown-item>
      <span>
        Promotional
      </span>
      <span class="ml-50">{{ bulkAccounts.promotional_credits.toLocaleString() }}</span>
    </b-dropdown-item>
    <b-dropdown-item>
      <span>
        Transactional
      </span>
      <span class="ml-50">{{ bulkAccounts.transactional_credits.toLocaleString() }}</span>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import Vue from 'vue'
import { ref } from '@vue/composition-api'
import { BNavItemDropdown, BDropdownItem } from 'bootstrap-vue'
import axios from '@axios'

export default {
  components: {
    BNavItemDropdown,
    BDropdownItem,
  },
  setup() {
    /* eslint-disable global-require */
    const bulkAccounts = ref(JSON.parse(JSON.stringify(Vue.$cookies.get('userData').bulk_accounts)))
    /* eslint-disable global-require */

    return {
      bulkAccounts,
    }
  },
  methods: {
    refreshBulkAccount() {
      axios.get(`/organisations/bulk-account/${this.bulkAccounts.id}`).then(res => {
        console.log(res.data)
        this.bulkAccounts = res.data
      })
        .catch(res => {
          console.log('ERROR OCCURED', res)
        })
    },
  },
}
</script>

<style>

</style>
