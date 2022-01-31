import Vue from 'vue'
import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
import { title } from '@core/utils/filter'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function usePayinsList() {
  // Use toast
  const toast = useToast()

  const refPayinListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'msisdn', label: 'Initiating Phone', sortable: true },
    { key: 'short_name', label: 'Paid In By', sortable: true },
    { key: 'amount', sortable: true, formatter: val => `KES${val}` },
    { key: 'trans_id', label: 'Transaction ID' },
    { key: 'ref_no', label: 'Bill Ref No.', formatter: title },
    { key: 'trans_time', sortable: true },
    { key: 'payin_status', label: 'Status', sortable: true },
  ]
  const perPage = ref(10)
  const totalPayins = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const statusFilter = ref(null)
  const isBusy = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refPayinListTable.value ? refPayinListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalPayins.value,
    }
  })

  const refetchData = () => {
    refPayinListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, statusFilter], () => {
    refetchData()
  })

  const fetchPayins = (ctx, callback) => {
    isBusy.value = true
    store
      .dispatch('payments/fetchPayins', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        status: statusFilter.value,
        org_id: JSON.parse(JSON.stringify(Vue.$cookies.get('userData').membership.organisation_id)),
      })
      .then(response => {
        const { results, count } = response.data
        callback(results)
        isBusy.value = false
        totalPayins.value = count
      })
      .catch(() => {
        isBusy.value = false
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching payins' list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolvePayinStatusVariantAndIcon = status => {
    if (status === 'UNPROCESSED') return { variant: 'warning', icon: 'PieChartIcon' }
    if (status === 'PROCESSED') return { variant: 'success', icon: 'CheckCircleIcon' }
    if (status === 'FAILED') return { variant: 'danger', icon: 'XIcon' }
    return { variant: 'secondary', icon: 'XIcon' }
  }
  const resolveClientAvatarVariant = status => {
    if (status === 'Past Due') return 'success'
    return 'success'
  }

  return {
    fetchPayins,
    tableColumns,
    perPage,
    currentPage,
    totalPayins,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refPayinListTable,

    statusFilter,
    isBusy,

    resolvePayinStatusVariantAndIcon,
    resolveClientAvatarVariant,
    refetchData,
  }
}
