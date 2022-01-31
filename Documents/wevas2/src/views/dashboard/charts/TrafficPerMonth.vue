<template>
  <div>
    <!-- datepicker -->
    <b-row class="match-height">
      <!-- Per Page -->
        <b-col
          cols="12"
          md="6"
          lg="4"
          sm="6"
        >
      <div class="d-flex align-items-center mb-2"
      style="margin-right:0px;"
      >
        <feather-icon
          icon="CalendarIcon"
          size="16"
          class="mr-1 text-success"
        />
        <flat-pickr
          v-model="rangePicker"
          @on-close="refetchData"
          :config="config"
          class="form-control flat-picker shadow-none"
          placeholder="Select Report Date"
        />
      </div>
    </b-col>
    </b-row>
      <!-- datepicker -->
    <b-card no-body>
    <b-card-header class="align-items-right">
    </b-card-header>

    <!-- charts -->
    <b-card-body>
      <chartjs-bar-chart
        v-if="loaded"
        :traffic-bar-chart="trafficBarChart" />
    </b-card-body>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BCardHeader,
  BCardBody,
  BRow,
  BCol,
} from 'bootstrap-vue'
import flatPickr from 'vue-flatpickr-component'
import moment from 'moment'
import { $themeColors } from '@themeConfig'
import ChartjsBarChart from './ChartjsBarChart.vue'

const chartColors = {
  primaryColorShade: '#836AF9',
  yellowColor: '#ffe800',
  successColorShade: '#8bc310',
  warningColorShade: '#ffe802',
  warningLightColor: '#FDAC34',
  infoColorShade: '#299AFF',
  greyColor: '#4F5D70',
  blueColor: '#2c9aff',
  blueLightColor: '#84D0FF',
  greyLightColor: '#EDF1F4',
  tooltipShadow: 'rgba(0, 0, 0, 0.25)',
  latestBarChartPrimary: '#666ee8',
  latestBarChartDanger: '#ff4961',
  labelColor: '#6e6b7b',
  grid_line_color: 'rgba(200, 200, 200, 0.2)',
}

export default {
  components: {
    BCard,
    BCardHeader,
    BCardBody,
    flatPickr,
    ChartjsBarChart,
    BCol,
    BRow,
  },
  data() {
    return {
      rangePicker: null,
      config: {
        mode: 'range',
        dateFormat: 'Y-m-d',
        allowInput: true,
      },
      userData: JSON.parse(JSON.stringify(this.$cookies.get('userData'))),
      loaded: true,
      trafficBarChart: {
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: chartColors.successColorShade,
              borderColor: 'transparent',
            },
          ],
        },
        options: {
          elements: {
            rectangle: {
              borderWidth: 2,
              borderSkipped: 'bottom',
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          responsiveAnimationDuration: 500,
          legend: {
            display: false,
          },
          tooltips: {
            // Updated default tooltip UI
            shadowOffsetX: 1,
            shadowOffsetY: 1,
            shadowBlur: 8,
            shadowColor: chartColors.tooltipShadow,
            backgroundColor: $themeColors.light,
            titleFontColor: $themeColors.dark,
            bodyFontColor: $themeColors.dark,
          },
          scales: {
            xAxes: [
              {
                display: true,
                gridLines: {
                  display: true,
                  color: chartColors.grid_line_color,
                  zeroLineColor: chartColors.grid_line_color,
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Date Sent',
                },
                ticks: {
                  fontColor: chartColors.labelColor,
                },
              },
            ],
            yAxes: [
              {
                display: true,
                gridLines: {
                  color: chartColors.grid_line_color,
                  zeroLineColor: chartColors.grid_line_color,
                },
                scaleLabel: {
                  display: true,
                  labelString: 'SMS Sent - Traffic',
                },
                ticks: {
                  stepSize: 10,
                  min: 0,
                  max: 100,
                  fontColor: chartColors.labelColor,
                },
              },
            ],
          },
        },
      },
    }
  },
  methods: {
    /* eslint-disable */
    refetchData(selectedDates, dateStr, instance) {
      this.loaded = false
      const start = moment(new Date(String(selectedDates[0]))).format('YYYY-MM-DD')
      const end = moment(new Date(String(selectedDates[1]))).format('YYYY-MM-DD')
      const orgId = this.userData.membership.organisation_id
      this.$http.get(`/stats/usage-traffic?start=${start}&end=${end}&org_id=${orgId}`).then(response => {
        this.trafficBarChart.data.labels = JSON.parse(JSON.stringify(response.data.graph_data.labels))
        this.trafficBarChart.data.datasets[0].data = JSON.parse(JSON.stringify(response.data.graph_data.traffic_graph_data))
        this.loaded = true
      })
    },
    /* eslint-enable */
  },
}
</script>
<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
