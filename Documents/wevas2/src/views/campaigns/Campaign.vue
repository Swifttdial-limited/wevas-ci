<template>
  <!-- Need to add height inherit because Vue 2 don't support multiple root ele -->
  <div style="height: inherit">
    <div
      class="body-content-overlay"
      :class="{'show': mqShallShowLeftSidebar}"
      @click="mqShallShowLeftSidebar = false"
    />
    <!-- Email List -->
    <div class="email-app-list">
    <div class="mx-2 mt-1 mb-1">
      <b-row class="row">
         <!-- Searchbar -->
         <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-start"
        >
          <b-input-group class="input-group-merge">
            <b-input-group-prepend is-text>
              <feather-icon
                icon="SearchIcon"
                class="text-muted"
              />
            </b-input-group-prepend>
            <b-form-input
              :value="searchQuery"
              placeholder="Search campaign"
              @input="updateRouteQuery"
            />
          </b-input-group>
        </b-col>
        <!-- pagination -->
       <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-start"
        >
        <span class="text-muted ml-auto mr-2 align-items-center">Showing {{ dataMeta.from }} to {{ dataMeta.to }} of {{ dataMeta.of }} entries</span>
          <b-pagination
            v-if="showCampaignDetails === false"
            v-model="currentPage"
            :total-rows="totalCampaigns"
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

     <!-- App Action Bar -->
      <div class="app-action">
        <div class="action-left">
          <b-form-checkbox
            :checked="selectAllCampaignCheckbox"
            :indeterminate="isSelectAllCampaignCheckboxIndeterminate"
            @change="selectAllCheckboxUpdate"
          >
            Select All
          </b-form-checkbox>
        </div>
        <div
          v-show="selectedCampaigns.length"
          class="align-items-center"
          :class="{'d-flex': selectedCampaigns.length}"
        >
          <feather-icon
            v-show="$route.params.folder !== 'trash'"
            icon="TrashIcon"
            size="17"
            class="cursor-pointer ml-1"
            @click="deleteCampaigns"
          />

        </div>
      </div>
    <!-- Email List -->
    <div class="email-app-list mt-1">

      <!-- App Searchbar Header -->
      <div class="app-fixed-search d-flex align-items-center">

        <!-- Toggler -->
        <div class="sidebar-toggle d-block d-lg-none ml-1">
          <feather-icon
            icon="MenuIcon"
            size="21"
            class="cursor-pointer"
            @click="mqShallShowLeftSidebar = true"
          />
        </div>
      </div>
            <!-- Emails List -->
      <vue-perfect-scrollbar
        :settings="perfectScrollbarSettings"
        class="email-user-list scroll-area"
      >
        <ul class="email-media-list">
          <b-media
            v-for="campaign in campaigns"
            :key="campaign.id"
            tag="li"
            no-body
            :class="{ 'mail-read': campaign.sync_completed }"
            @click="updateCampaignViewData(campaign)"
          >

            <b-media-aside class="media-left mr-50">
              <div class="user-action">
                <b-form-checkbox
                  :checked="selectedCampaigns.includes(campaign.id)"
                  @change="toggleSelectedCampaign(campaign.id)"
                  @click.native.stop
                />
                <!-- <div class="email-favorite">
                  <feather-icon
                    icon="StarIcon"
                    size="17"
                    :class="{ 'text-warning fill-current': campaign.sync_completed }"
                    @click.stop="toggleStarred(campaign)"
                  />
                </div> -->
              </div>
            </b-media-aside>

            <b-media-body>
              <div class="mail-details">
                <div class="mail-items">
                  <span class="text-truncate">{{ campaign.subject }}</span>
                </div>
                <div class="mail-meta-item">
                  <span
                    class="mx-50 bullet bullet-sm"
                    :class="`bullet-${resolveLabelColor(campaign.state)}`"
                  />
                  <span class="mail-date">{{ formatDateToMonthShort(campaign.created_at, { hour: 'numeric', minute: 'numeric', }) }}</span>
                </div>
              </div>

              <div class="mail-message">
                <p class="text-truncate mb-0">
                  {{ filterTags(campaign.message) }}
                </p>
              </div>
            </b-media-body>
          </b-media>
        </ul>
        <div
          class="no-results"
          :class="{'show': !campaigns.length}"
        >
          <h5>No Items Found</h5>
        </div>
      </vue-perfect-scrollbar>
    </div>
    </div>

    <!-- Email View/Detail -->
    <campaign-view
      :class="{'show': showCampaignDetails}"
      :email-view-data="campaignViewData"
      :opended-email-meta="opendedCampaignMeta"
      @close-email-view="showCampaignDetails = false"
      @change-opened-email="changeOpenedCampaign"
    />

    <!-- Sidebar -->
    <portal to="content-renderer-sidebar-left">
      <email-left-sidebar
        :shall-show-email-compose-modal.sync="shallShowEmailComposeModal"
        :emails-meta="campaignsMeta"
        :class="{'show': mqShallShowLeftSidebar}"
        @close-left-sidebar="mqShallShowLeftSidebar = false"
      />
    </portal>

    <!-- Compose Campaign Modal -->
    <campaign-compose v-model="shallShowEmailComposeModal"/>
  </div>
</template>

<script>
import store from '@/store'
import Vue from 'vue'
import {
  ref, onUnmounted, computed, watch,
  // ref, watch, computed, onUnmounted,
} from '@vue/composition-api'
import {
  BFormInput, BInputGroup, BInputGroupPrepend,
  BMedia, BMediaBody, BMediaAside, BFormCheckbox,
  BPagination, BRow, BCol,
} from 'bootstrap-vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { filterTags, formatDateToMonthShort } from '@core/utils/filter'
import { useRouter } from '@core/utils/utils'
import { useResponsiveAppLeftSidebarVisibility } from '@core/comp-functions/ui/app'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { useToast } from 'vue-toastification/composition'
import EmailLeftSidebar from './EmailLeftSidebar.vue'
import CampaignView from './CampaignView.vue'
import campaignStoreModule from './campaignStoreModule'
// import emailStoreModule from './emailStoreModule'
import useCampaign from './useCampaign'
import CampaignCompose from './CampaignCompose.vue'

export default {
  components: {
    BFormInput,
    BInputGroup,
    BInputGroupPrepend,
    BPagination,
    BRow,
    BCol,
    // BDropdown,
    // BDropdownItem,
    BFormCheckbox,
    BMedia,
    BMediaAside,
    BMediaBody,
    // BAvatar,

    // 3rd Party
    VuePerfectScrollbar,

    // App SFC
    EmailLeftSidebar,
    // CampaignView,
    CampaignCompose,
    CampaignView,
  },
  setup() {
    const perPage = ref(10)
    const totalCampaigns = ref(0)
    const currentPage = ref(1)
    const CAMPAIGNS_STORE_MODULE_NAME = 'campaigns'
    const membership = ref(JSON.parse(JSON.stringify(Vue.$cookies.get('userData').membership)))

    // Register module
    if (!store.hasModule(CAMPAIGNS_STORE_MODULE_NAME)) store.registerModule(CAMPAIGNS_STORE_MODULE_NAME, campaignStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CAMPAIGNS_STORE_MODULE_NAME)) store.unregisterModule(CAMPAIGNS_STORE_MODULE_NAME)
    })

    const { route, router } = useRouter()
    const { resolveLabelColor } = useCampaign()

    // Route Params
    const routeParams = computed(() => route.value.params)
    watch([routeParams, currentPage, perPage], () => {
      // eslint-disable-next-line no-use-before-define
      fetchCampaigns()
    })
    // Campaigns & CampaignsMeta
    const campaigns = ref([])
    const campaignsMeta = ref({})
    const toast = useToast()

    const perfectScrollbarSettings = {
      maxScrollbarLength: 150,
    }

    // Search Query
    const routeQuery = computed(() => route.value.query.q)
    const searchQuery = ref(routeQuery.value)
    watch(routeQuery, val => {
      searchQuery.value = val
    })
    // Pagination data
    const dataMeta = computed(() => {
      const localItemsCount = campaigns.value ? campaigns.value.length : 0
      return {
        from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
        to: perPage.value * (currentPage.value - 1) + localItemsCount,
        of: totalCampaigns.value,
      }
    })
    // eslint-disable-next-line no-use-before-define
    watch(searchQuery, () => fetchCampaigns())
    const updateRouteQuery = val => {
      const currentRouteQuery = JSON.parse(JSON.stringify(route.value.query))

      if (val) currentRouteQuery.q = val
      else delete currentRouteQuery.q

      router.replace({ name: route.name, query: currentRouteQuery })
    }

    const fetchCampaigns = () => {
      store.dispatch('campaigns/fetchCampaigns', {
        q: searchQuery.value,
        state: router.currentRoute.params.state,
        org_id: membership.value.organisation_id,
        per_page: perPage.value,
        page: currentPage.value,
      })
        .then(response => {
          campaigns.value = response.data.results
          campaignsMeta.value = response.data.meta
          totalCampaigns.value = response.data.count
        })
    }
    const refreshCampaignsData = () => {
      fetchCampaigns()
    }

    fetchCampaigns()

    // ------------------------------------------------
    // Mail Selection
    // ------------------------------------------------
    const selectedCampaigns = ref([])
    const deleteCampaigns = () => {
      const postData = {
        campaign_ids: JSON.parse(JSON.stringify(selectedCampaigns.value)),
        org_id: membership.value.organisation_id,
      }
      console.log('Post Data', postData)
      store.dispatch('campaigns/deleteCampaigns', postData)
        .then(response => {
          console.log(response.data)
          toast({
            component: ToastificationContent,
            props: {
              title: 'Campaigns Deleted Successfully',
              icon: 'CoffeeIcon',
              variant: 'success',
            },
          })
          refreshCampaignsData()
          selectedCampaigns.value = []
        })
    }
    const toggleSelectedCampaign = campaignId => {
      const campaignIndex = selectedCampaigns.value.indexOf(campaignId)

      if (campaignIndex === -1) selectedCampaigns.value.push(campaignId)
      else selectedCampaigns.value.splice(campaignIndex, 1)
    }
    const selectAllCampaignCheckbox = computed(() => campaigns.value.length && (campaigns.value.length === selectedCampaigns.value.length))
    const isSelectAllCampaignCheckboxIndeterminate = computed(() => Boolean(selectedCampaigns.value.length) && campaigns.value.length !== selectedCampaigns.value.length)
    const selectAllCheckboxUpdate = val => {
      selectedCampaigns.value = val ? campaigns.value.map(campaign => campaign.id) : []
    }
    // ------------------------------------------------
    // Campaign details
    // ------------------------------------------------
    const showCampaignDetails = ref(false)
    const campaignViewData = ref({})
    const opendedCampaignMeta = computed(() => {
      const openedCampaignIndex = campaigns.value.findIndex(c => c.id === campaignViewData.value.id)
      return {
        hasNextCampaign: Boolean(campaigns.value[openedCampaignIndex + 1]),
        hasPreviousCampaign: Boolean(campaigns.value[openedCampaignIndex - 1]),
      }
    })
    const changeOpenedCampaign = dir => {
      const openedCampaignIndex = campaigns.value.findIndex(c => c.id === campaignViewData.value.id)
      const newCampaignIndex = dir === 'previous' ? openedCampaignIndex - 1 : openedCampaignIndex + 1
      campaignViewData.value = campaigns.value[newCampaignIndex]
    }
    const updateCampaignViewData = campaign => {
      campaignViewData.value = campaign
      showCampaignDetails.value = true
    }

    // * If someone clicks on filter while viewing detail => Close the campaign detail view
    watch(routeParams, () => {
      showCampaignDetails.value = false
    })

    // * Watcher to reset selectedCampaigns
    // ? You can also use showCampaignDetails (instead of `campaignViewData`) but it will trigger execution twice in this case
    // eslint-disable-next-line no-use-before-define
    watch([campaignViewData, routeParams], () => {
      selectedCampaigns.value = []
    })

    // Compose
    const shallShowEmailComposeModal = ref(false)

    // Left Sidebar Responsiveness
    const { mqShallShowLeftSidebar } = useResponsiveAppLeftSidebarVisibility()

    return {
      // UI
      perfectScrollbarSettings,

      // Campaigns & CampaignsMeta
      campaigns,
      campaignsMeta,

      // Campaign Selection
      selectAllCampaignCheckbox,
      isSelectAllCampaignCheckboxIndeterminate,
      selectedCampaigns,
      toggleSelectedCampaign,
      selectAllCheckboxUpdate,
      // Campaign Details
      showCampaignDetails,
      campaignViewData,
      opendedCampaignMeta,
      updateCampaignViewData,
      changeOpenedCampaign,
      refreshCampaignsData,

      // Search Query
      searchQuery,
      updateRouteQuery,

      // UI Filters
      filterTags,
      formatDateToMonthShort,

      // useCampaign
      resolveLabelColor,

      // Compose
      shallShowEmailComposeModal,

      // Left Sidebar Responsiveness
      mqShallShowLeftSidebar,

      // Pagination
      perPage,
      currentPage,
      totalCampaigns,
      dataMeta,
      deleteCampaigns,
    }
  },
  // methods: {
  //   deleteSelectedCampaigns() {
  //     this.deleteCampaigns()
  //     console.log('selected', JSON.parse(JSON.stringify(this.selectedCampaigns)))
  //   },
  // },
}
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">
@import "~@core/scss/base/pages/app-email.scss";
</style>
