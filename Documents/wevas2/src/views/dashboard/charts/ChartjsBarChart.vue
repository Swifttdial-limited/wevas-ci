<template>
  <b-card no-body>
    <!-- chart -->
    <b-card-body>
      <chartjs-component-bar-chart
        :height="400"
        :data="trafficBarChart.data"
        :options="trafficBarChart.options"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardBody,
} from 'bootstrap-vue'

import ChartjsComponentBarChart from '../charts-components/ChartjsComponentBarChart.vue'
// import chartjsData from './chartjsData'

export default {
  components: {
    BCard,
    BCardBody,
    ChartjsComponentBarChart,
  },
  props: {
    trafficBarChart: {
      type: Object,
      default: null,
    },
  },
}
</script>
