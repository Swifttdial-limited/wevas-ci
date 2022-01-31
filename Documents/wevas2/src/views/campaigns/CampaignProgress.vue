<template>
  <div>
      <b-row>
        <b-col cols="12">
            <b-card-actions
              ref="refreshCard"
              title="Delivery Report"
              action-refresh
              @refresh="refetchData('refreshCard')"
            >
            <div class="d-flex justify-content-between">
              <h5 class="mb-0">
                Traffic-: <b-badge class="ml-1" variant="secondary">{{ progressReport.traffic }}</b-badge>
                <span class="ml-2">
                Delivered-: <b-badge class="ml-1" variant="primary">{{ progressReport.delivered }}</b-badge>
                </span>
                <span class="ml-2">
                Undelivered-: <b-badge class="ml-1" variant="warning">{{ progressReport.undelivered }}</b-badge>
                </span>
                <span  class="ml-2">
                Failed-: <b-badge class="ml-1" variant="danger">{{ progressReport.failed }}</b-badge>
                </span>
                <span  class="ml-2">
                Queued-: <b-badge class="ml-1" variant="dark">{{ progressReport.queued }}</b-badge>
                </span>
                <span  class="ml-2">
                Stopped-: <b-badge class="ml-1" variant="dark">{{ progressReport.stopped }}</b-badge>
                </span>
                <span
                v-if="canBeStopped"
                class="ml-5">
                  <b-button
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    variant="danger"
                    @click="onstopCampaign"
                  >
                    Stop
                  </b-button>
                </span>
              </h5>
            </div>
            </b-card-actions>
        </b-col>
      </b-row>
  </div>
</template>

<script>
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import {
  BRow, BCol, BBadge, BButton,
} from 'bootstrap-vue'
import {
  ref,
  watch,
  computed,
} from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  directives: {
    Ripple,
  },
  components: {

    // BSV
    BRow,
    BCol,
    BBadge,
    // BCard,
    BCardActions,
    BButton,
  },
  props: {
    campaignId: {
      type: Number,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const toast = useToast()
    const blankprogressReport = {
      total: 0,
      processed: 0,
      failed: 0,
      undelivered: 0,
      delivered: 0,
      queued: 0,
      stopped: 0,
      waiting: 0,
      traffic: 0,
      state: '',
    }
    const progressReport = ref(JSON.parse(JSON.stringify(blankprogressReport)))
    const refreshCard = ref(null)
    const canBeStopped = computed(() => progressReport.value.state !== 6 && progressReport.value.state !== 4 && (progressReport.value.traffic > progressReport.value.sent))
    const getCampaignProgress = () => {
      store
        .dispatch('campaigns/getCampaignProgress', { id: props.campaignId })
        .then(response => {
          console.log('Res', response.data)
          progressReport.value = response.data
          refreshCard.value.showLoading = false
        })
        .catch(() => {
          toast({
            component: ToastificationContent,
            props: {
              title: 'Error fetching campaing progress report',
              icon: 'AlertTriangleIcon',
              variant: 'danger',
            },
          })
        })
    }
    const stopCampaign = () => {
      store
        .dispatch('campaigns/stopCampaign', { id: props.campaignId })
        .then(response => {
          console.log('Res', response.data)
          toast({
            component: ToastificationContent,
            props: {
              title: 'Campaign Was Stopped Successfully',
              icon: 'CoffeeIcon',
              variant: 'success',
            },
          })
        })
        .catch(() => {
          toast({
            component: ToastificationContent,
            props: {
              title: 'Error stopping campaing',
              icon: 'AlertTriangleIcon',
              variant: 'danger',
            },
          })
        })
    }
    const onstopCampaign = () => {
      stopCampaign()
    }
    watch(() => props.campaignId, () => {
      getCampaignProgress()
    })
    const refetchData = () => {
      getCampaignProgress()
    }
    return {
      getCampaignProgress,
      progressReport,
      refetchData,
      refreshCard,
      canBeStopped,
      onstopCampaign,
    }
  },
}
</script>

<style>

</style>
