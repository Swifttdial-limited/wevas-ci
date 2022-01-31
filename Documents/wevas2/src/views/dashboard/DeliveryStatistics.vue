<template>
  <b-card
    no-body
    class="card-statistics"
  >
    <b-card-header>
      <b-card-sub-title>Delivery and Usage Count</b-card-sub-title>
      <b-card-text class="font-small-2 mr-25 mb-0">
        <feather-icon
        size="24"
        icon="circleIcon"
        />
      </b-card-text>
    </b-card-header>
    <b-card-body class="statistics-body">
      <b-row>
        <b-col
          xl="2"
          sm="6"
          class="mb-2 mb-xl-0"
        >
          <b-media no-body>
            <b-media-aside

              class="mr-2"
            >
              <b-avatar
                size="48"
                variant="success"
              >
                <feather-icon
                  size="24"
                  icon="BarChart2Icon"
                  class="text-secondary"
                />
              </b-avatar>
            </b-media-aside>
            <b-media-body class="my-auto">
              <h4 class="font-weight-bolder mb-0">
                {{ deliveryReport.total.toLocaleString() }}
              </h4>
              <b-card-text class="font-small-3 mb-0">
               Traffic
              </b-card-text>
            </b-media-body>
          </b-media>
        </b-col>
        <b-col
          xl="2"
          sm="6"
          class="mb-2 mb-xl-0"
        >
          <b-media no-body>
            <b-media-aside

              class="mr-2"
            >
              <b-avatar
                size="48"
                variant="primary"
              >
                <feather-icon
                  size="24"
                  icon="CheckCircleIcon"
                  class="text-secondary"
                />
              </b-avatar>
            </b-media-aside>
            <b-media-body class="my-auto">
              <h4 class="font-weight-bolder mb-0">
                {{ deliveryReport.delivered.toLocaleString() }}
              </h4>
              <b-card-text class="font-small-3 mb-0">
               Delivered
              </b-card-text>
            </b-media-body>
          </b-media>
        </b-col>
        <b-col
          xl="2"
          sm="6"
          class="mb-2 mb-xl-0"
        >
          <b-media no-body>
            <b-media-aside

              class="mr-2"
            >
              <b-avatar
                size="48"
                variant="warning"
              >
                <feather-icon
                  size="24"
                  icon="SlashIcon"
                  class="text-secondary"
                />
              </b-avatar>
            </b-media-aside>
            <b-media-body class="my-auto">
              <h4 class="font-weight-bolder mb-0">
                {{ deliveryReport.undelivered.toLocaleString() }}
              </h4>
              <b-card-text class="font-small-3 mb-0">
               Undelivered
              </b-card-text>
            </b-media-body>
          </b-media>
        </b-col>
        <b-col
          xl="2"
          sm="6"
          class="mb-2 mb-xl-0"
        >
          <b-media no-body>
            <b-media-aside

              class="mr-2"
            >
              <b-avatar
                size="48"
                variant="danger"
              >
                <feather-icon
                  size="24"
                  icon="XCircleIcon"
                  class="text-dark"
                />
              </b-avatar>
            </b-media-aside>
            <b-media-body class="my-auto">
              <h4 class="font-weight-bolder mb-0">
                {{ deliveryReport.failed.toLocaleString() }}
              </h4>
              <b-card-text class="font-small-3 mb-0">
               Failed
              </b-card-text>
            </b-media-body>
          </b-media>
        </b-col>
        <b-col
          xl="2"
          sm="6"
          class="mb-2 mb-xl-0"
        >
          <b-media no-body>
            <b-media-aside

              class="mr-2"
            >
              <b-avatar
                size="48"
                variant="secondary"
              >
                <feather-icon
                  size="24"
                  icon="ClockIcon"
                  class="text-dark"
                />
              </b-avatar>
            </b-media-aside>
            <b-media-body class="my-auto">
              <h4 class="font-weight-bolder mb-0">
                {{ deliveryReport.queued.toLocaleString() }}
              </h4>
              <b-card-text class="font-small-3 mb-0">
               Pending
              </b-card-text>
            </b-media-body>
          </b-media>
        </b-col>
        <b-col
          xl="2"
          sm="6"
          class="mb-2 mb-xl-0"
        >
          <b-media no-body>
            <b-media-aside

              class="mr-2"
            >
              <b-avatar
                size="48"
                variant="primary"
              >
                <feather-icon
                  size="24"
                  icon="MessageSquareIcon"
                />
              </b-avatar>
            </b-media-aside>
            <b-media-body class="my-auto">
              <h4 class="font-weight-bolder mb-0">
                {{ deliveryReport.units_used.toLocaleString() }}
              </h4>
              <b-card-text class="font-small-3 mb-0">
               SMS Units Used
              </b-card-text>
            </b-media-body>
          </b-media>
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardText, BCardBody, BRow, BCol, BMedia, BMediaAside, BAvatar, BMediaBody, BCardSubTitle,
} from 'bootstrap-vue'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardText,
    BCardBody,
    BMedia,
    BAvatar,
    BMediaAside,
    BMediaBody,
    BCardSubTitle,
  },
  props: {
    deliveryReport: {
      type: Object,
      required: true,
    },
  },
}
</script>
