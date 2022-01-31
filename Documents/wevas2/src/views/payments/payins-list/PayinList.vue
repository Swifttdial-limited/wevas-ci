<template>

  <!-- Table Container Card -->
  <b-card
    no-body
  >

    <div class="m-2">

      <!-- Table Top -->
      <b-row>

        <!-- Per Page -->
        <b-col
          cols="12"
          md="6"
          class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
        >
          <label>Entries</label>
          <v-select
            v-model="perPage"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="perPageOptions"
            :clearable="false"
            class="per-page-selector d-inline-block ml-50 mr-1"
          />
        </b-col>

        <!-- Search -->
        <b-col
          cols="12"
          md="6"
        >
          <div class="d-flex align-items-center justify-content-end">
            <b-form-input
              v-model="searchQuery"
              class="d-inline-block mr-1"
              placeholder="Search by Transaction ID or Phone Number ..."
            />
            <v-select
              v-model="statusFilter"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="statusOptions"
              label="label"
              :reduce="label => label.value"
              class="payin-filter-select"
              placeholder="Select Status"
            >
              <template #selected-option="{ label }">
                <span class="text-truncate overflow-hidden">
                  {{ label }}
                </span>
              </template>
            </v-select>
          </div>
        </b-col>
      </b-row>

    </div>

    <b-table
      ref="refPayinListTable"
      :items="fetchPayins"
      responsive
      :fields="tableColumns"
      primary-key="id"
      :sort-by.sync="sortBy"
      :busy.sync="isBusy"
      show-empty
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
      class="position-relative"
    >
    <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner
          label="Loading..."
          class="align-middle">
          </b-spinner>
          <strong class=" ml-2">Fetching...</strong>
        </div>
      </template>
      <!-- Column: Payin Status -->
      <template #cell(payin_status)="data">
        <b-avatar
          :id="`payin-row-${data.item.id}`"
          size="32"
          :variant="`light-${resolvePayinStatusVariantAndIcon(data.item.payin_status).variant}`"
        >
          <feather-icon
            :icon="resolvePayinStatusVariantAndIcon(data.item.payin_status).icon"
          />
        </b-avatar>
        <b-tooltip
          :target="`payin-row-${data.item.id}`"
          placement="top"
        >
          <p class="mb-0">
            Status: {{ data.item.payin_status }}
          </p>
          <p class="mb-0">
            Amount: {{ data.item.amount }}
          </p>
          <p class="mb-0">
            Transaction Time: {{ data.item.trans_time }}
          </p>
        </b-tooltip>
      </template>
      <template #cell(msisdn)="data">
        <span class="text-nowrap">
          {{ data.item.msisdn }}
        </span>
      </template>

      <!-- Column: Client -->
      <template #cell(short_name)="data">
        <b-media vertical-align="center">
          <template #aside>
            <b-avatar
              size="32"
              :src="data.item.avatar"
              :text="avatarText(data.item.short_name)"
              :variant="`light-${resolveClientAvatarVariant(data.item.payin_status)}`"
            />
          </template>
          <span class="font-weight-bold d-block text-nowrap">
            {{ data.item.short_name }}
          </span>
          <small class="text-muted">{{ data.item.msisdn }}</small>
        </b-media>
      </template>
      <!-- Column: Balance -->
      <template #cell(amount)="data">
        <template v-if="data.item.amount >= 300">
          <b-badge
            pill
            variant="light-success"
          >
            KES {{ data.item.amount }}
          </b-badge>
        </template>
        <template v-else>
          KES {{ data.item.amount }}
        </template>
      </template>

      <!-- Column: Issued Date -->
      <template #cell(trans_id)="data">
        <span class="text-nowrap">
          {{ data.item.trans_id }}
        </span>
      </template>
      <!-- Column: Issued Date -->
      <template #cell(ref_no)="data">
        <span class="text-nowrap">
          {{ data.item.ref_no }}
        </span>
      </template>

      <!-- Column: Issued Date -->
      <template #cell(trans_time)="data">
        <span class="text-nowrap">
          {{ data.value }}
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
            :total-rows="totalPayins"
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

</template>

<script>
import {
  BCard, BRow, BCol, BFormInput, BTable, BMedia, BAvatar,
  BBadge, BPagination, BTooltip, BSpinner,
} from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'
import vSelect from 'vue-select'
import { onUnmounted } from '@vue/composition-api'
import store from '@/store'
import usePayinsList from './usePayinList'

import paymentsStoreModule from '../paymentsStoreModule'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BTable,
    BMedia,
    BAvatar,
    BBadge,
    BPagination,
    BTooltip,
    BSpinner,

    vSelect,
  },
  setup() {
    const PAYMENT_APP_STORE_MODULE_NAME = 'payments'

    // Register module
    if (!store.hasModule(PAYMENT_APP_STORE_MODULE_NAME)) store.registerModule(PAYMENT_APP_STORE_MODULE_NAME, paymentsStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PAYMENT_APP_STORE_MODULE_NAME)) store.unregisterModule(PAYMENT_APP_STORE_MODULE_NAME)
    })
    const statusOptions = [
      { label: 'Pending', value: 0 },
      { label: 'Processed', value: 1 },
      { label: 'Failed', value: 2 },
    ]

    const {
      fetchPayins,
      tableColumns,
      perPage,
      currentPage,
      totalPayins,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refPayinListTable,

      statusFilter,

      refetchData,
      isBusy,

      resolvePayinStatusVariantAndIcon,
      resolveClientAvatarVariant,
    } = usePayinsList()

    return {
      fetchPayins,
      tableColumns,
      perPage,
      currentPage,
      totalPayins,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refPayinListTable,

      statusFilter,

      refetchData,
      isBusy,

      statusOptions,

      avatarText,
      resolvePayinStatusVariantAndIcon,
      resolveClientAvatarVariant,
    }
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
/* Busy table styling */
table.b-table[aria-busy='true'] {
  opacity: 0.6;
}

.payin-filter-select {
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
