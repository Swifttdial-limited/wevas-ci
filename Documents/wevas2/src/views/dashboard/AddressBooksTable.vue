<template>
  <b-card
    v-if="tableData"
    no-body
    class="card-company-table"
  >
  <b-card-body>
      <b-card-sub-title>Contacts by Operator</b-card-sub-title>
    </b-card-body>
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
  BCard, BTable, BCardSubTitle, BCardBody,
} from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BTable,
    BCardSubTitle,
    BCardBody,
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
        { key: 'operator', sortable: true },
        { key: 'contacts', sortable: true },
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
