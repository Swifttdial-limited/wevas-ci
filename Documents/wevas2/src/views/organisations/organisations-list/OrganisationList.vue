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
            @click="isAddNewOrganisationSidebarActive = true"
          >
            <span  class="text-nowrap">Add New Organisation</span>
          </b-button> -->
        </b-col>

        <!-- Search -->
        <b-col
          cols="12"
          md="6"
        >
          <div class="d-flex align-items-center justify-content-center">
            <b-form-input
              v-model="searchQuery"
              class="d-inline-block mr-1"
              placeholder="Search..."
            />
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="primary"
              :to="{ name: 'organisations-add-new' }"
              class=""
            >
              <span class="text-nowrap">Add New Organisation</span>
          </b-button>
          </div>
        </b-col>
      </b-row>

    </div>

    <b-table
      id="organisation-list-table"
      ref="refOrganisationListTable"
      :items="fetchOrganisations"
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
      <!-- Column: Promotional Credits -->
      <template #cell(promotional_credits)="data">
        <span class="text-nowrap">
          <b-badge
          :id="`organisation-row-${data.item.id}-promotional-credits`"
          variant="success"
          >
          {{ data.item.bulk_account.promotional_credits }}
          </b-badge>
          <b-tooltip
            title="Sms Lemgth"
            class="cursor-pointer"
            :target="`organisation-row-${data.item.id}-promotional-credits`"
            placement="topright"
          >
          <p class="mb-0">
            SMS Units: {{ data.item.bulk_account.promotional_credits }}
          </p>
        </b-tooltip>
        </span>
      </template>
      <!-- Column: Promotional Credits -->
      <template #cell(transactional_credits)="data">
        <span class="text-nowrap">
          <b-badge
          :id="`organisation-row-${data.item.id}-transactional-credits`"
          variant="primary"
          >
          {{ data.item.bulk_account.transactional_credits }}
          </b-badge>
          <b-tooltip
            title="Sms Lemgth"
            class="cursor-pointer"
            :target="`organisation-row-${data.item.id}-transactional-credits`"
            placement="topright"
          >
          <p class="mb-0">
            SMS Units: {{ data.item.bulk_account.transactional_credits }}
          </p>
        </b-tooltip>
        </span>
      </template>
      <!-- Column: Created Date -->
      <template #cell(created_at)="data">
        <span class="text-nowrap"
        :id="`organisation-row-${data.item.id}-created-at`"
        >
          {{ formatDateToMonthLong(data.value) }}
        <b-tooltip
            title="Sent At"
            class="cursor-pointer"
            :target="`organisation-row-${data.item.id}-created-at`"
            placement="topright"
          >
          <p class="mb-0">
            {{ data.item.created_at }}
          </p>
        </b-tooltip>
        </span>
      </template>
      <!-- Column: Actions -->
      <template #cell(actions)="data">

        <div class="text-nowrap">
          <!-- Dropdown -->
          <b-dropdown
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
            <b-dropdown-item :to="{ name: 'address-books-group-view', params: { id: data.item.id } }">
              <feather-icon icon="SettingsIcon" />
              <span class="align-middle ml-50">Top Up Bulk</span>
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'address-books-group-manage-contacts', params: { id: data.item.id } }">
              <feather-icon icon="HashIcon" />
              <span class="align-middle ml-50">Assign Sender ID</span>
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'address-books-group-manage-contacts', params: { id: data.item.id } }">
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>
            <b-dropdown-item>
              <feather-icon icon="TrashIcon" />
              <span class="align-middle ml-50">Delete</span>
            </b-dropdown-item>
          </b-dropdown>
        </div>
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
            :total-rows="totalOrganisations"
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
  BPagination, BDropdown, BDropdownItem,
  BTooltip, BBadge, BButton,
} from 'bootstrap-vue'
// import { avatarText } from '@core/utils/filter'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import { onUnmounted } from '@vue/composition-api'
import store from '@/store'
import { formatDateToMonthLong, title } from '@utils/filters'
import useOrganisationList from './useOrganisationList'

import organisationsStoreModule from '../organisationsStoreModule'

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
    BDropdown,
    BDropdownItem,
    BPagination,
    BTooltip,

    vSelect,
  },
  directives: {
    Ripple,
  },
  setup() {
    const ORGANISATION_STORE_MODULE_NAME = 'organisations'

    // Register module
    if (!store.hasModule(ORGANISATION_STORE_MODULE_NAME)) store.registerModule(ORGANISATION_STORE_MODULE_NAME, organisationsStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(ORGANISATION_STORE_MODULE_NAME)) store.unregisterModule(ORGANISATION_STORE_MODULE_NAME)
    })

    // const isAddNewOrganisationSidebarActive = ref(false)

    const statusOptions = [
      { name: 'Delivered', value: 3 },
      { name: 'Undelivered', value: 4 },
      { name: 'Queued', value: 1 },
      { name: 'Failed', value: 6 },
    ]
    const {
      fetchOrganisations,
      perPage,
      tableColumns,
      currentPage,
      totalOrganisations,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refOrganisationListTable,

      statusFilter,

      refetchData,
      isBusy,

      // resolveOrganisationStatusVariantAndIcon,
    } = useOrganisationList()

    return {
      fetchOrganisations,
      tableColumns,
      perPage,
      currentPage,
      totalOrganisations,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refOrganisationListTable,

      statusFilter,

      refetchData,

      statusOptions,
      isBusy,
      formatDateToMonthLong,
      title,

      // avatarText,
      // resolveOrganisationStatusVariantAndIcon,
      // isAddNewOrganisationSidebarActive,
    }
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.organisation-filter-select {
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
