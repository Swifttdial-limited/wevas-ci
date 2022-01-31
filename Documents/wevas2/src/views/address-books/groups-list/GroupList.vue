<template>
<div>
  <group-list-add-new
      :is-add-new-group-sidebar-active.sync="isAddNewGroupSidebarActive"
      @refetch-data="refetchData"
    />
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
          <b-button
            variant="primary"
            @click="isAddNewGroupSidebarActive = true"
          >
            <span  class="text-nowrap">Add New Group</span>
          </b-button>
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
              placeholder="Search by Name..."
            />
            <!-- <v-select
              v-model="statusFilter"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="statusOptions"
              class="group-filter-select"
              placeholder="Select Status"
            >
              <template #selected-option="{ label }">
                <span class="text-truncate overflow-hidden">
                  {{ label }}
                </span>
              </template>
            </v-select> -->
          </div>
        </b-col>
      </b-row>

    </div>

    <b-table
      ref="refGroupListTable"
      :items="fetchGroups"
      responsive
      :fields="tableColumns"
      primary-key="id"
      :sort-by.sync="sortBy"
      show-empty
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
      class="position-relative"
    >
      <!-- Column: Name -->
      <template #cell(name)="data">
        <b-link
          :to="{ name: 'address-books-group-view', params: { id: data.item.id }}"
          class="font-weight-bold"
        >
        <feather-icon
                icon="FolderPlusIcon"
                class="text-success mr-1"
                size="18"
        />
          {{ data.value }}
        </b-link>
      </template>
      <!-- Column: Group Status -->
      <template #cell(state_description)="data">
        <b-avatar
          :id="`group-row-${data.item.id}-status`"
          size="32"
          :variant="`light-${resolveGroupStatusVariantAndIcon(data.item.state_description).variant}`"
        >
          <feather-icon
            :icon="resolveGroupStatusVariantAndIcon(data.item.state_description).icon"
          />
        </b-avatar>
      </template>

      <!-- Column: Num Contacts -->
      <template #cell(num_contacts)="data">
        <template v-if="data.value >= 100">
          <b-badge
            pill
            variant="light-success"
          >
            {{ data.value }}
          </b-badge>
        </template>
        <template v-else>
         <b-badge
            pill
            variant="light-primary"
          >
            {{ data.value }}
          </b-badge>
        </template>
      </template>
      <!-- Column: Created Date -->
      <template #cell(created_at)="data">
        <span class="text-nowrap">
          {{ data.value }}
        </span>
      </template>
      <!-- Column: Quick to -->
      <!-- <template #cell(quick_to)="data">
        <b-button
            variant="secondary"
           :id="`group-row-${data.item.id}-quick-to`"
          >
          <span  class="text-nowrap">Send Message</span>
        </b-button>
      </template> -->

      <!-- Column: Actions -->
      <template #cell(actions)="data">

        <div class="text-nowrap">
          <b-button
          variant="success"
          class="mr-1"
          @click="showCompose(data.item.id)"
          >
          Send Message
          </b-button>
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
              <span class="align-middle ml-50">Manage</span>
            </b-dropdown-item>
            <!-- <b-dropdown-item :to="{ name: 'address-books-group-manage-contacts', params: { id: data.item.id } }">
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>
            <b-dropdown-item>
              <feather-icon icon="TrashIcon" />
              <span class="align-middle ml-50">Delete</span>
            </b-dropdown-item> -->
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
            :total-rows="totalGroups"
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
  <campaign-compose v-model="shallShowEmailComposeModal" :to="groupId"/>
</div>
</template>

<script>
import {
  BCard, BRow, BCol, BFormInput, BButton, BTable, BAvatar, BLink,
  BBadge, BDropdown, BDropdownItem, BPagination,
} from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'
import vSelect from 'vue-select'
import { onUnmounted, ref } from '@vue/composition-api'
import store from '@/store'
import useGroupsList from './useGroupList'
import GroupListAddNew from './GroupListAddNew.vue'

import addressBookStoreModule from '../addressBookStoreModule'
import CampaignCompose from '../../campaigns/CampaignCompose.vue'

export default {
  components: {
    GroupListAddNew,
    CampaignCompose,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    // BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,

    vSelect,
  },
  setup() {
    const ADDRESS_BOOK_STORE_MODULE_NAME = 'address-books'

    // Register module
    if (!store.hasModule(ADDRESS_BOOK_STORE_MODULE_NAME)) store.registerModule(ADDRESS_BOOK_STORE_MODULE_NAME, addressBookStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(ADDRESS_BOOK_STORE_MODULE_NAME)) store.unregisterModule(ADDRESS_BOOK_STORE_MODULE_NAME)
    })

    const isAddNewGroupSidebarActive = ref(false)
    const shallShowEmailComposeModal = ref(false)
    const groupId = ref(null)
    const showCompose = id => {
      groupId.value = id
    }

    const statusOptions = [
      'Downloaded',
      'Draft',
      'Paid',
      'Partial Payment',
      'Past Due',
    ]
    const {
      fetchGroups,
      tableColumns,
      perPage,
      currentPage,
      totalGroups,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refGroupListTable,

      statusFilter,

      refetchData,

      resolveGroupStatusVariantAndIcon,
      resolveClientAvatarVariant,
    } = useGroupsList()

    return {
      fetchGroups,
      tableColumns,
      perPage,
      currentPage,
      totalGroups,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refGroupListTable,

      statusFilter,

      refetchData,

      statusOptions,

      avatarText,
      resolveGroupStatusVariantAndIcon,
      resolveClientAvatarVariant,
      isAddNewGroupSidebarActive,
      groupId,
      showCompose,
      shallShowEmailComposeModal,
    }
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.group-filter-select {
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
