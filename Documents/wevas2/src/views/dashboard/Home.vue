<template>
  <section id="dashboard-ecommerce">
    <b-row class="match-height">
      <!-- Per Page -->
        <b-col
          cols="12"
          md="6"
          class="d-flex align-items-start justify-content-start mb-md-0"
        >
         <h5 class="card-title">
            Delivery Report
          </h5>
        </b-col>

        <!-- Search -->
        <b-col
          cols="12"
          md="6"
        >
          <div class="d-flex align-items-start justify-content-start mb-1 ml-auto">
            <label>Report Date</label>
            <flat-pickr
            v-model="rangeConfig.defaultDate"
            @on-close="refreshReport"
            class="form-control"
            :config="rangeConfig"
          />
          </div>
        </b-col>
    </b-row>
    <b-row class="match-height">
      <!-- <b-col
        xl="4"
        md="6"
      >
        <delivery-rate-chart />
      </b-col> -->
      <b-col
        xl="12"
        md="6"
      >
        <delivery-statistics :delivery-report="deliveryReport" />
      </b-col>
    </b-row>
    <b-row class="match-height">
      <!-- Company Table Card -->
      <b-col lg="6">
        <traffic-by-operator-table :table-data="trafficTableData" />
      </b-col>
      <b-col lg="6">
        <address-books-table :tableData="addressBooksTableData"/>
      </b-col>
    </b-row>
    <hr>
    <b-row class="match-height">
      <!-- Per Page -->
        <b-col
          cols="12"
          md="6"
          class="d-flex align-items-start justify-content-start mb-md-0"
        >
         <h5 class="card-title">
            Usage Traffic
          </h5>
        </b-col>

        <!-- Search -->
        <b-col
          cols="12"
          md="6"
        >
          <div class="d-flex align-items-start justify-content-start mb-1 ml-auto">
          </div>
        </b-col>
    </b-row>
    <div class="">
      <traffic-per-month />
    </div>
    <h5 class="card-title">
    Last 5 Messages Sent
    </h5>
    <b-row class="match-height">
      <!-- Company Table Card -->
      <b-col lg="12">
       <outbox-table :table-data="outboxTableData" />
      </b-col>
    </b-row>
  </section>
</template>

<script>
import Vue from 'vue'
import {
  ref, onUnmounted,
} from '@vue/composition-api'
import { BRow, BCol } from 'bootstrap-vue'
import flatPickr from 'vue-flatpickr-component'
import store from '@/store'
import moment from 'moment'
import DeliveryStatistics from './DeliveryStatistics.vue'
// import DeliveryRateChart from './DeliveryRateChart.vue'
import TrafficByOperatorTable from './TrafficByOperatorTable.vue'
import AddressBooksTable from './AddressBooksTable.vue'
import OutboxTable from './OutboxTable.vue'
import TrafficPerMonth from './charts/TrafficPerMonth.vue'
import statsStoreModule from './statsStoreModule'

export default {
  components: {
    BRow,
    BCol,
    // BCardText,
    DeliveryStatistics,
    // DeliveryRateChart,
    TrafficByOperatorTable,
    AddressBooksTable,
    OutboxTable,
    flatPickr,
    TrafficPerMonth,
  },
  setup() {
    const STATS_STORE_MODULE_NAME = 'stats'
    // Register module
    if (!store.hasModule(STATS_STORE_MODULE_NAME)) store.registerModule(STATS_STORE_MODULE_NAME, statsStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(STATS_STORE_MODULE_NAME)) store.unregisterModule(STATS_STORE_MODULE_NAME)
    })
    const blankDeliveryReport = {
      sent: 0,
      waiting: 0,
      queued: 0,
      delivered: 0,
      undelivered: 0,
      failed: 0,
      cancelled: 0,
      total: 0,
      units_used: 0,
    }
    const blankConfig = {
      mode: 'range',
      dateFormat: 'Y-m-d',
      allowInput: true,
      defaultDate: [],
    }
    const rangeConfig = ref(JSON.parse(JSON.stringify(blankConfig)))
    const trafficTableData = ref([])
    const addressBooksTableData = ref([])
    const outboxTableData = ref([])
    const dateRange = ref([])
    const deliveryReport = ref(JSON.parse(JSON.stringify(blankDeliveryReport)))
    /* eslint-disable */
    const refreshReport = (selectedDates, dateStr, instance) => {
      const start = moment(new Date(String(selectedDates[0]))).format('YYYY-MM-DD')
      const end = moment(new Date(String(selectedDates[1]))).format('YYYY-MM-DD')
      store.dispatch('stats/fetchReport', {
        start: start,
        end: end,
        org_id: JSON.parse(JSON.stringify(Vue.$cookies.get('userData').membership.organisation_id)),
      })
        .then(response => {
          deliveryReport.value = response.data.delivery_report
          trafficTableData.value = response.data.operator_traffic
          addressBooksTableData.value = response.data.contacts_by_operator
          outboxTableData.value = response.data.outbox
        })
    }
    const fetchReport = () => {
      store.dispatch('stats/fetchReport', {
        org_id: JSON.parse(JSON.stringify(Vue.$cookies.get('userData').membership.organisation_id))
      })
        .then(response => {
          deliveryReport.value = response.data.delivery_report
          trafficTableData.value = response.data.operator_traffic
          addressBooksTableData.value = response.data.contacts_by_operator
          outboxTableData.value = response.data.outbox
          rangeConfig.value.defaultDate.push(response.data.start)
          rangeConfig.value.defaultDate.push(response.data.end)
        })
    }
    /* eslint-enable */
    fetchReport()
    return {
      fetchReport,
      deliveryReport,
      refreshReport,
      trafficTableData,
      addressBooksTableData,
      outboxTableData,
      rangeConfig,
      dateRange,
    }
  },
  data() {
    return {
      data: {},
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/dashboard-ecommerce.scss';
@import '@core/scss/vue/libs/chart-apex.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
