<template>
<div>
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
          <!-- <b-button
            variant="primary"
            @click="isAddNewOutboxSidebarActive = true"
          >
            <span  class="text-nowrap">Add New Outbox</span>
          </b-button> -->
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
              placeholder="Search by recipient or message...."
            />
            <v-select
              v-model="statusFilter"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="statusOptions"
              label="name"
              :reduce="name => name.value"
              class="outbox-filter-select"
              placeholder="Select Status"
            >
            </v-select>
          </div>
        </b-col>
      </b-row>

    </div>

    <b-table
      id="outbox-list-table"
      ref="refOutboxListTable"
      :items="fetchOutbox"
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
    <template #cell(show_details)="row">
      <div class="text-nowrap">
          <b-button variant="success" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
      </b-button>
        <!-- <b-dropdown
          variant="link"
          toggle-class="p-0"
          no-caret
          :right="$store.state.appConfig.isRTL"
        >
          <template #button-content>
            <feather-icon
              icon="MoreVerticalIcon"
              size="16"
              class="align-middle text-body"
            />
          </template>
          <b-dropdown-item>
            <feather-icon icon="SendIcon" />
            <span class="align-middle ml-50">Forward</span>
          </b-dropdown-item>
          <b-dropdown-item>
            <feather-icon icon="EyeIcon" />
            <span class="align-middle ml-50">View Campaign</span>
          </b-dropdown-item>
        </b-dropdown> -->
        </div>
    </template>
      <!-- Column: SMS Count -->
      <template #cell(sms_count)="data">
        <span class="text-nowrap">
          <b-badge
          :id="`outbox-row-${data.item.id}-sms-count`"
          variant="warning"
          >
          {{ data.item.sms_count }}
          </b-badge>
          <b-tooltip
            title="Sms Lemgth"
            class="cursor-pointer"
            :target="`outbox-row-${data.item.id}-sms-count`"
            placement="topright"
          >
          <p class="mb-0">
            Message Length: {{ data.item.sms_count }}
          </p>
        </b-tooltip>
        </span>
      </template>
      <!-- Column: SMS State -->
      <template #cell(state)="data">
        <span class="text-nowrap">
          <b-badge
          :id="`outbox-row-${data.item.id}-state`"
          :variant="resolveOutboxStatusVariant(data.item.state).variant"
          >
          {{ data.item.state }}
          </b-badge>
          <b-tooltip
          v-if="data.item.notes && data.item.notes.length >0"
            title="Notes"
            class="cursor-pointer"
            :target="`outbox-row-${data.item.id}-state`"
            placement="topright"
          >
          <p class="mb-0">
            Notes: {{ data.item.notes }}
          </p>
        </b-tooltip>
        </span>
      </template>
      <!-- Column: Recipient -->
      <template #cell(recipient)="data">
        <span class="text-nowrap">
          <feather-icon
                icon="PhoneIcon"
                class="text-success mr-1"
                size="18"
          />
          {{ data.item.recipient }}
        </span>
      </template>
      <!-- Column: Created Date -->
      <template #cell(created_at)="data">
        <span class="text-nowrap"
        :id="`outbox-row-${data.item.id}-sent-at`"
        >
          {{ formatDateToMonthLong(data.value) }}
        <b-tooltip
            title="Sent At"
            class="cursor-pointer"
            :target="`outbox-row-${data.item.id}-sent-at`"
            placement="topright"
          >
          <p class="mb-0">
            {{ data.item.created_at }}
          </p>
        </b-tooltip>
        </span>
      </template>
      <template #row-details="row">
        <b-card>
          <b-row>
        <b-col cols="12">
            <div>
              <span class="ml-1"><strong class="mr-1 text-muted">Type:</strong> {{ row.item.type }}</span>
                <span class="ml-2">
                <strong class="ml-3 text-muted">Operator : </strong><span class="ml-1">{{ row.item.operator }}</span>
                </span>
                <span class="ml-2">
                <strong class="ml-3 text-muted">Reference No. :</strong> <span class="ml-1"><em>{{ row.item.ref_no }}</em></span>
                </span>
            </div>
        </b-col>
        </b-row>
      </b-card>
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
            :total-rows="totalOutbox"
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
</div>
</template>

<script>
import {
  BCard, BRow, BCol,
  BFormInput, BTable, BSpinner,
  BPagination,
  BTooltip, BBadge, BButton,
} from 'bootstrap-vue'
// import { avatarText } from '@core/utils/filter'
import vSelect from 'vue-select'
import { onUnmounted } from '@vue/composition-api'
import store from '@/store'
import { formatDateToMonthLong, title } from '@utils/filters'
import useApiOutboxList from './useApiOutboxList'

import outBoxStoreModule from '../outBoxStoreModule'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BTable,
    BSpinner,
    BBadge,
    BButton,
    // BMedia,
    // BAvatar,
    // BLink,
    // BBadge,
    // BDropdown,
    // BDropdownItem,
    BPagination,
    BTooltip,

    vSelect,
  },
  setup() {
    const OUTBOX_STORE_MODULE_NAME = 'outbox'

    // Register module
    if (!store.hasModule(OUTBOX_STORE_MODULE_NAME)) store.registerModule(OUTBOX_STORE_MODULE_NAME, outBoxStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(OUTBOX_STORE_MODULE_NAME)) store.unregisterModule(OUTBOX_STORE_MODULE_NAME)
    })

    // const isAddNewOutboxSidebarActive = ref(false)

    const statusOptions = [
      { name: 'Delivered', value: 3 },
      { name: 'Undelivered', value: 4 },
      { name: 'Queued', value: 1 },
      { name: 'Failed', value: 6 },
    ]
    const {
      fetchOutbox,
      perPage,
      tableColumns,
      currentPage,
      totalOutbox,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refOutboxListTable,
      resolveOutboxStatusVariant,

      statusFilter,

      refetchData,
      isBusy,

      // resolveOutboxStatusVariantAndIcon,
    } = useApiOutboxList()

    return {
      fetchOutbox,
      tableColumns,
      perPage,
      currentPage,
      totalOutbox,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refOutboxListTable,
      resolveOutboxStatusVariant,

      statusFilter,

      refetchData,

      statusOptions,
      isBusy,
      // formatDateToMonthLong,
      title,
      formatDateToMonthLong,

      // avatarText,
      // resolveOutboxStatusVariantAndIcon,
      // isAddNewOutboxSidebarActive,
    }
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.outbox-filter-select {
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
