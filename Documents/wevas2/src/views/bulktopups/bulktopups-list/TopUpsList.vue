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
            @click="isAddNewStoplistSidebarActive = true"
          >
            <span  class="text-nowrap">Add New Stoplist</span>
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
              placeholder="Search by Payment Ref"
            />
            <v-select
              v-model="typeFilter"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="typeOptions"
              label="name"
              :reduce="name => name.value"
              class="type-filter-select"
              placeholder="Select Type"
            >
            </v-select>
          </div>
        </b-col>
      </b-row>

    </div>

    <b-table
      id="topuplist-list-table"
      ref="refTopupListTable"
      :items="fetchTopuplists"
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
    <!-- Column: Created Date -->
      <template #cell(credits)="data">
        <span class="text-nowrap">
          {{ data.value.toLocaleString() }}
        </span>
      </template>
      <!-- Column: Created Date -->
      <template #cell(created_at)="data">
        <span class="text-nowrap"
        :id="`topuplist-row-${data.item.id}-credited-on`"
        >
          {{ formatDateToMonthLong(data.value) }}
        <b-tooltip
            title="Credited on"
            class="cursor-pointer"
            :target="`topuplist-row-${data.item.id}-credited-on`"
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
            :total-rows="totalTopuplists"
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
  BTooltip,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import { onUnmounted } from '@vue/composition-api'
import store from '@/store'
import { formatDateToMonthLong, title } from '@utils/filters'
import useTopUpList from './useTopUpsList'

import bulktopupsStoreModule from '../bulktopupsStoreModule'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BTable,
    BSpinner,
    // BBadge,
    // BButton,
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
    const TOPUPLIST_STORE_MODULE_NAME = 'bulktopups'
    const typeOptions = [
      { name: 'Promotional', value: 1 },
      { name: 'Transactional', value: 2 },
    ]

    // Register module
    if (!store.hasModule(TOPUPLIST_STORE_MODULE_NAME)) store.registerModule(TOPUPLIST_STORE_MODULE_NAME, bulktopupsStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(TOPUPLIST_STORE_MODULE_NAME)) store.unregisterModule(TOPUPLIST_STORE_MODULE_NAME)
    })
    const {
      fetchTopuplists,
      perPage,
      tableColumns,
      currentPage,
      totalTopuplists,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refTopupListTable,
      refetchData,
      isBusy,
      typeFilter,
    } = useTopUpList()
    return {
      fetchTopuplists,
      tableColumns,
      perPage,
      currentPage,
      totalTopuplists,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refTopupListTable,
      refetchData,
      isBusy,
      formatDateToMonthLong,
      title,
      typeFilter,
      typeOptions,
    }
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
