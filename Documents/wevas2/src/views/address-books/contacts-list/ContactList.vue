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
            @click="isAddNewContactSidebarActive = true"
          >
            <span  class="text-nowrap">Add New Contact</span>
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
              placeholder="Search..."
            />
            <v-select
              v-model="operatorFilter"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="operatorOptions"
              class="contact-filter-select"
              placeholder="Select Operator"
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
      id="contact-list-table"
      ref="refContactListTable"
      :items="fetchContacts"
      responsive
      primary-key="id"
      :sort-by.sync="sortBy"
      show-empty
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
      class="position-relative"
    >
      <!-- Contact: Id -->
      <template #cell(id)="data">
        <b-link
          :to="{ name: 'apps-contact-preview', params: { id: data.item.id }}"
          class="font-weight-bold"
        >
          #{{ data.value }}
        </b-link>
      </template>
      <!-- Column: Recipient -->
      <template #cell(contact)="data">
        <b-avatar
          :id="`group-row-${data.item.id}-type`"
          size="32"
          :variant="`light-${resolveContactTypeVariantAndIcon(data.item.type).variant}`"
        >
          <feather-icon
            :icon="resolveContactTypeVariantAndIcon(data.item.type).icon"
          />
        </b-avatar>
          <span class="ml-2">{{ data.item.contact }}</span>
      </template>
      <!-- Column: Actions -->
      <template #cell(actions)="data">

        <div class="text-nowrap">
          <feather-icon
            :id="`contact-row-${data.item.id}-send-icon`"
            icon="SendIcon"
            class="cursor-pointer"
            size="16"
          />
          <b-tooltip
            title="Send Contact"
            class="cursor-pointer"
            :target="`contact-row-${data.item.id}-send-icon`"
          />

          <feather-icon
            :id="`contact-row-${data.item.id}-preview-icon`"
            icon="EyeIcon"
            size="16"
            class="mx-1"
            @click="$router.push({ name: 'apps-contact-preview', params: { id: data.item.id }})"
          />
          <b-tooltip
            title="Preview Contact"
            :target="`contact-row-${data.item.id}-preview-icon`"
          />

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
            <b-dropdown-item>
              <feather-icon icon="DownloadIcon" />
              <span class="align-middle ml-50">Download</span>
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'address', params: { id: data.item.id } }">
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>
            <b-dropdown-item>
              <feather-icon icon="TrashIcon" />
              <span class="align-middle ml-50">Delete</span>
            </b-dropdown-item>
            <b-dropdown-item>
              <feather-icon icon="CopyIcon" />
              <span class="align-middle ml-50">Duplicate</span>
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
            :total-rows="totalContacts"
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
  BCard, BRow, BCol, BFormInput, BTable, BAvatar, BLink,
  BDropdown, BDropdownItem, BPagination, BTooltip,
} from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'
import vSelect from 'vue-select'
import { onUnmounted } from '@vue/composition-api'
import store from '@/store'
import useContactsList from './useContactList'

import addressBookStoreModule from '../addressBookStoreModule'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BTable,
    // BMedia,
    BAvatar,
    BLink,
    // BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BTooltip,

    vSelect,
  },
  props: {
    groupId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const ADDRESS_BOOK_STORE_MODULE_NAME = 'address-books'

    // Register module
    if (!store.hasModule(ADDRESS_BOOK_STORE_MODULE_NAME)) store.registerModule(ADDRESS_BOOK_STORE_MODULE_NAME, addressBookStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(ADDRESS_BOOK_STORE_MODULE_NAME)) store.unregisterModule(ADDRESS_BOOK_STORE_MODULE_NAME)
    })

    // const isAddNewContactSidebarActive = ref(false)

    const operatorOptions = [
      'Safaricom',
      'Airtel',
      'Telkom',
      'Finserve',
    ]
    const {
      fetchContacts,
      perPage,
      currentPage,
      totalContacts,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refContactListTable,

      operatorFilter,

      refetchData,

      resolveContactTypeVariantAndIcon,
      resolveClientAvatarVariant,
    } = useContactsList(props)

    return {
      fetchContacts,
      perPage,
      currentPage,
      totalContacts,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refContactListTable,

      operatorFilter,

      refetchData,

      operatorOptions,

      avatarText,
      resolveContactTypeVariantAndIcon,
      resolveClientAvatarVariant,
      // isAddNewContactSidebarActive,
    }
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.contact-filter-select {
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
