<template>
<div>
  <!-- Table Container Card -->
  <b-card
    no-body
  >
  <div class="m-2">
      <!-- Table Top -->
      <b-row>
        <!-- Search -->
        <b-col
          cols="12"
          md="6"
        >
          <div class="d-flex align-items-center justify-content-start mb-1 mb-md-0">
            <span class="">{{ viewKeysTextToggle }}</span>
            <feather-icon
            class="cursor-pointer ml-1"
            size="20"
            :icon="passwordToggleIcon"
            @click="togglePasswordVisibility"
          />
          </div>
        </b-col>
        <b-col
          cols="12"
          md="6"
        >
        <div class="d-flex align-items-center justify-content-end mb-1 mb-md-0">
        <b-button
            variant="primary"
            v-b-modal.modal-add-app-key
          >
            <span  class="text-nowrap">Add New API Key</span>
          </b-button>
        </div>
        </b-col>
      </b-row>
  </div>
    <b-table
      id="apikeylist-list-table"
      ref="refApiKeyListTable"
      :items="fetchApiKeyList"
      :fields="tableColumns"
      responsive
      primary-key="id"
      :sort-by.sync="sortBy"
      show-empty
      bordered
      :outlined="true"
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
      class="position-relative"
    >
    <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong class="p-2"> Loading...</strong>
        </div>
    </template>
    <!-- Column: Recipient -->
      <template #cell(api_key_encoded)="data">
        <b-input-group
          class="input-group-merge"
        >
        <b-form-input
          id="login-password"
          :value="data.value"
          :type="passwordFieldType"
          class="form-control-merge"
          disabled
        />
        <b-input-group-append is-text>
          <feather-icon
            class="cursor-pointer"
            icon="CopyIcon"
            @click="copyAppKey(data.value)"
          />
        </b-input-group-append>
        </b-input-group>
      </template>
      <!-- Column: Created Date -->
      <template #cell(created_at)="data">
        <span class="text-nowrap"
        :id="`apikeylist-row-${data.item.id}-created-at`"
        >
          {{ formatDateToMonthLong(data.value) }}
        <b-tooltip
            title="Credited on"
            class="cursor-pointer"
            :target="`apikeylist-row-${data.item.id}-created-at`"
            placement="topright"
          >
          <p class="mb-0">
            {{ data.item.created_at }}
          </p>
        </b-tooltip>
        </span>
      </template>
    </b-table>
    <div class="mx-2 mb-2">
      <b-row>

        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-start"
        >
          <span class="text-muted">Showing {{ dataMeta.from }} to {{ dataMeta.to }} of {{ dataMeta.of }} entries</span>
        </b-col>
        <!-- Pagination -->
        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-end"
        >

          <b-pagination
            v-model="currentPage"
            :total-rows="totalApiKeyList"
            :per-page="perPage"
            first-number
            last-number
            class="mb-0 mt-1 mt-sm-0"
            prev-class="prev-item"
            next-class="next-item"
          >
            <template #prev-text>
              <feather-icon
                icon="ChevronLeftIcon"
                size="18"
              />
            </template>
            <template #next-text>
              <feather-icon
                icon="ChevronRightIcon"
                size="18"
              />
            </template>
          </b-pagination>

        </b-col>

      </b-row>
    </div>
  </b-card>
  <b-modal
      id="modal-add-app-key"
      cancel-variant="outline-secondary"
      ok-title="Add"
      cancel-title="Close"
      title="Add New APi Key"
      @ok="addApiKeys"
    >
      <b-form>
        <b-form-group>
          <label for="name">App Name:</label>
          <b-form-input
            id="name"
            type="text"
            v-model="addApiKeyPayload.name"
            placeholder="App Name"
          />
        </b-form-group>
      </b-form>
    </b-modal>
</div>
</template>

<script>
import {
  BCard, BRow, BCol,
  BTable, BSpinner,
  BPagination,
  BTooltip,
  BFormInput,
  BInputGroup,
  BButton,
  BInputGroupAppend,
  BFormGroup,
  BForm,
  BModal,
  VBModal,
} from 'bootstrap-vue'
// import vSelect from 'vue-select'
import Vue from 'vue'
import { onUnmounted, ref } from '@vue/composition-api'
import store from '@/store'
import { formatDateToMonthLong, title } from '@utils/filters'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import { useClipboard } from '@vueuse/core'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { useToast } from 'vue-toastification/composition'
import useApiKeysList from './useApiKeysList'

import apikeysStoreModule from '../apikeysStoreModule'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    // BFormInput,
    BTable,
    BSpinner,
    // BBadge,
    BButton,
    // BMedia,
    // BAvatar,
    // BLink,
    // BBadge,
    // BDropdown,
    // BDropdownItem,
    BPagination,
    BTooltip,
    BFormInput,
    BInputGroup,
    BInputGroupAppend,
    BFormGroup,
    BForm,
    BModal,
    // vSelect,
  },
  mixins: [togglePasswordVisibility],
  directives: {
    'b-modal': VBModal,
  },
  setup() {
    const APIKEYS_STORE_MODULE_NAME = 'apikeys'
    // Register module
    if (!store.hasModule(APIKEYS_STORE_MODULE_NAME)) store.registerModule(APIKEYS_STORE_MODULE_NAME, apikeysStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(APIKEYS_STORE_MODULE_NAME)) store.unregisterModule(APIKEYS_STORE_MODULE_NAME)
    })
    const toast = useToast()
    const { copy } = useClipboard()

    const copyAppKey = appKey => {
      copy(appKey)

      toast({
        component: ToastificationContent,
        props: {
          title: 'X-API-Key copied to clipboard',
          icon: 'CopyIcon',
          variant: 'success',
        },
      })
    }
    const membership = JSON.parse(JSON.stringify(Vue.$cookies.get('userData').membership))
    const blankAddAPiKeyPayload = {
      name: '',
      org_id: membership.organisation_id,
    }
    const addApiKeyPayload = ref(JSON.parse(JSON.stringify(blankAddAPiKeyPayload)))
    const {
      fetchApiKeyList,
      perPage,
      tableColumns,
      currentPage,
      totalApiKeyList,
      dataMeta,
      sortBy,
      isSortDirDesc,
      refApiKeyListTable,
      refetchData,
      isBusy,
    } = useApiKeysList()
    const addApiKeys = () => {
      console.log('Post data', JSON.parse(JSON.stringify(addApiKeyPayload.value)))
      store.dispatch('apikeys/addNewApiKey', JSON.parse(JSON.stringify(addApiKeyPayload.value)))
        .then(response => {
          console.log(response.data)
          toast({
            component: ToastificationContent,
            props: {
              title: 'APi Key Added Successfully',
              icon: 'CoffeeIcon',
              variant: 'success',
            },
          })
          refetchData()
        })
    }
    return {
      fetchApiKeyList,
      tableColumns,
      perPage,
      currentPage,
      totalApiKeyList,
      dataMeta,
      sortBy,
      isSortDirDesc,
      refApiKeyListTable,
      refetchData,
      isBusy,
      formatDateToMonthLong,
      title,
      copyAppKey,
      addApiKeyPayload,
      addApiKeys,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    viewKeysTextToggle() {
      return this.passwordFieldType === 'password' ? 'Reveal API Keys' : 'Hide API Keys'
    },
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.type-filter-select {
  min-width: 190px;

  ::v-deep .vs__selected-options {
    flex-wrap: nowrap;
  }

  ::v-deep .vs__selected {
    width: 100px;
  }
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
