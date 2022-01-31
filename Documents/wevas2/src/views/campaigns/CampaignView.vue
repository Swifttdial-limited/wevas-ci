<template>
  <div class="email-app-details">

    <!-- Email Header -->
    <div class="email-detail-header">

      <!-- Header: Left -->
      <div class="email-header-left d-flex align-items-center">
        <span class="go-back mr-1">
          <feather-icon
            :icon="$store.state.appConfig.isRTL ? 'ChevronRightIcon' : 'ChevronLeftIcon'"
            size="20"
            class="align-bottom"
            @click="$emit('close-email-view')"
          />
        </span>
        <h4 class="email-subject mb-0">
          {{ emailViewData.subject }}
        </h4>
      </div>
    </div>
    <!-- Email Details -->
    <vue-perfect-scrollbar
      :settings="perfectScrollbarSettings"
      class="email-scroll-area scroll-area"
    >
    <!-- Campaigns Progress -->
      <b-row
      class="mt-2"
      >
        <b-col cols="12">
          <campaign-progress :campaign-id="emailViewData.id" />
        </b-col>
      </b-row>
      <!-- Label Row -->
      <b-row>
        <b-col
        lg="9"
        sm="12"
        md="9"
        >
          <div class="email-label">
            <b-badge
              pill
              class="text-capitalize mr-50"
              :variant="`light-${resolveLabelColor(emailViewData.state)}`"
            >
              {{ resolveLabelName(emailViewData.state) }}
            </b-badge>
          </div>
        </b-col>
        <b-col
        lg="3"
        sm="12"
        md="3"
        >
          <div
          v-if="emailViewData.state === 2"
          class="email-label">

            <span>
               Will start at: {{ emailViewData.started_at }}
            </span>
          </div>
          <div
          v-if="emailViewData.state != 2 && emailViewData.state != 0"
          class="email-label">

            <span>
               Started at: {{ emailViewData.created_at }}
            </span>
          </div>
          <div
          v-if="emailViewData.state === 0"
          class="email-label">

            <span>
               Not Started
            </span>
          </div>
        </b-col>
      </b-row>
      <!-- Campaigns Thread -->
      <b-row>
        <b-col cols="12">
          <campaign-message-card :message="emailViewData" />
        </b-col>
      </b-row>

      <!-- Email Actions: Reply or Forward -->
      <b-row>
        <b-col cols="12">
          <!-- <b-card>
            <div class="d-flex justify-content-between">
              <h5 class="mb-0">
                Click here to
                <b-link>Forward</b-link>
              </h5>
            </div>
          </b-card> -->
        </b-col>
      </b-row>
    </vue-perfect-scrollbar>
  </div>
</template>

<script>
import {
  BRow, BCol, BBadge,
} from 'bootstrap-vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { ref, watch } from '@vue/composition-api'
import CampaignMessageCard from './CampaignMessageCard.vue'
import CampaignProgress from './CampaignProgress.vue'
import useCampaign from './useCampaign'

export default {
  components: {

    // BSV
    // BDropdown,
    // BDropdownItem,
    BRow,
    BCol,
    BBadge,
    // BCard,
    // BLink,

    // 3rd Party
    VuePerfectScrollbar,

    // SFC
    CampaignMessageCard,
    CampaignProgress,
  },
  props: {
    emailViewData: {
      type: Object,
      required: true,
    },
    opendedEmailMeta: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { resolveLabelColor, resolveLabelName } = useCampaign()
    const showWholeThread = ref(false)

    const perfectScrollbarSettings = {
      maxScrollbarLength: 150,
    }

    watch(() => props.emailViewData.id, () => {
      showWholeThread.value = false
    })

    return {

      // UI
      perfectScrollbarSettings,

      // useCampaign
      resolveLabelColor,
      resolveLabelName,
      showWholeThread,
    }
  },
}
</script>

<style>

</style>
