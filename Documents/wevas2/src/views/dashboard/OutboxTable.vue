<template>
  <b-card
    v-if="tableData"
    no-body
    class="card-company-table"
  >
    <b-table
      :items="tableData"
      responsive
      :fields="fields"
      class="mb-0"
    >
    </b-table>
  </b-card>
</template>

<script>
import {
  BCard, BTable,
} from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BTable,
  },
  props: {
    tableData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      fields: [
        { key: 'message', sortable: true },
        { key: 'recipient', sortable: true },
        { key: 'sender', label: 'From', sortable: true },
        { key: 'state', label: 'Status', sortable: true },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
@import '~@core/scss/base/components/variables-dark';

.card-company-table ::v-deep td .b-avatar.badge-light-company {
  .dark-layout & {
    background: $theme-dark-body-bg !important;
  }
}
</style>
