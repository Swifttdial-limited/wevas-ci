<template>
  <div class="sidebar-left">
    <div class="sidebar">
      <div class="sidebar-content email-app-sidebar">
        <div class="email-app-menu">
          <div class="form-group-compose text-center compose-btn">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              block
              @click="$emit('update:shall-show-email-compose-modal', true); $emit('close-left-sidebar'); $emit('close-campaign-progress')"
            >
              Create Bulk Campaign
            </b-button>
          </div>
          <vue-perfect-scrollbar
            :settings="perfectScrollbarSettings"
            class="sidebar-menu-list scroll-area"
          >
            <!-- Filters -->
            <b-list-group class="list-group-messages">
              <!-- Labels -->
            <h6 class="section-label mt-1 mb-1 px-2">
              Bulk Campaigns
            </h6>
              <b-list-group-item
                v-for="filter in emailFilters"
                :key="filter.title + $route.path"
                :to="filter.route"
                :active="isDynamicRouteActive(filter.route)"
                @click="$emit('close-left-sidebar')"
              >
                <feather-icon
                  :icon="filter.icon"
                  size="18"
                  class="mr-75"
                />
                <span class="align-text-bottom line-height-1">{{ filter.title }}</span>
                <b-badge
                  v-if="emailsMeta[filter.title.toLowerCase()]"
                  pill
                  :variant="resolveFilterBadgeColor(filter.title)"
                  class="float-right"
                >
                  {{ emailsMeta[filter.title.toLowerCase()] }}
                </b-badge>
              </b-list-group-item>
            </b-list-group>
            <!-- Labels -->
            <!-- <h6 class="section-label mt-3 mb-1 px-2">
              Trash &amp; Archive
            </h6>

            <b-list-group class="list-group-labels">
              <b-list-group-item
                v-for="label in emailLabel"
                :key="label.title + $route.path"
                :to="label.route"
                :active="isDynamicRouteActive(label.route)"
                @click="$emit('close-left-sidebar')"
              >
                <feather-icon
                  :icon="label.icon"
                  :class="'text-'+label.color"
                  size="18"
                  class="mr-75"
                />
                <span>{{ label.title }}</span>
              </b-list-group-item>
            </b-list-group> -->
          </vue-perfect-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import {
  BButton, BListGroup, BListGroupItem, BBadge,
} from 'bootstrap-vue'
import store from '@/store'
import {
  onUnmounted,
  // ref, watch, computed, onUnmounted,
} from '@vue/composition-api'
import { isDynamicRouteActive } from '@core/utils/utils'
import Ripple from 'vue-ripple-directive'
import campaignStoreModule from './campaignStoreModule'

export default {
  directives: {
    Ripple,
  },
  components: {

    // BSV
    BButton,
    BListGroup,
    BListGroupItem,
    BBadge,

    // 3rd Party
    VuePerfectScrollbar,
  },
  props: {
    shallShowEmailComposeModal: {
      type: Boolean,
      required: true,
    },
    emailsMeta: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const CAMPAIGNS_STORE_MODULE_NAME = 'campaigns'
    // Register module
    if (!store.hasModule(CAMPAIGNS_STORE_MODULE_NAME)) store.registerModule(CAMPAIGNS_STORE_MODULE_NAME, campaignStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CAMPAIGNS_STORE_MODULE_NAME)) store.unregisterModule(CAMPAIGNS_STORE_MODULE_NAME)
    })

    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
    }
    const emailFilters = [
      { title: 'Sent', icon: 'SendIcon', route: { name: 'bulk-campaigns' } },
      { title: 'Waiting', icon: 'LoaderIcon', route: { name: 'bulk-campaigns-state', params: { state: 0 } } },
      { title: 'Queued', icon: 'ClockIcon', route: { name: 'bulk-campaigns-state', params: { state: 1 } } },
      { title: 'Scheduled', icon: 'CalendarIcon', route: { name: 'bulk-campaigns-state', params: { state: 2 } } },
      { title: 'Stopped', icon: 'XCircleIcon', route: { name: 'bulk-campaigns-state', params: { state: 6 } } },
      { title: 'Draft', icon: 'Edit2Icon', route: { name: 'bulk-campaigns-state', params: { state: 5 } } },
      // { title: 'Paused', icon: 'PauseCircleIcon', route: { name: 'bulk-campaigns-state', params: { state: 3 } } },
    ]

    const emailLabel = [
      {
        title: 'Archive',
        color: 'dark',
        icon: 'ArchiveIcon',
        route: {
          name: 'bulk-campaigns-label',
          params: {
            label: 'archive',
          },
        },
      },
      {
        title: 'Trash',
        color: 'danger',
        icon: 'TrashIcon',
        route: {
          name: 'bulk-campaigns-label',
          params: {
            label: 'deleted',
          },
        },
      },
    ]

    const resolveFilterBadgeColor = filter => {
      if (filter === 'Draft') return 'light-secondary'
      if (filter === 'Scheduled') return 'light-secondary'
      if (filter === 'Paused') return 'light-info'
      if (filter === 'Stopped') return 'light-danger'
      if (filter === 'Waiting') return 'light-secondary'
      if (filter === 'Queued') return 'light-warning'
      return 'light-primary'
    }

    return {
      // UI
      perfectScrollbarSettings,
      isDynamicRouteActive,
      resolveFilterBadgeColor,

      // Filter & Labels
      emailFilters,
      emailLabel,
    }
  },
}
</script>

<style>

</style>
