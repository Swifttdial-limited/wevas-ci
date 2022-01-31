import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
import Vue from 'vue'
// import router from '@/router'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useStopList() {
  // Use toast
  const toast = useToast()

  const refStoplistListTable = ref(null)
  // Table Handlers
  const tableColumns = [
    { key: 'sender_name', sortable: true },
    { key: 'recipient', sortable: true },
    { key: 'created_at', label: 'Opted Out On', sortable: true },
    // { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalStoplists = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const sendersFilter = ref(null)
  const isSortDirDesc = ref(true)
  const isBusy = ref(false)
  const dataMeta = computed(() => {
    const localItemsCount = refStoplistListTable.value ? refStoplistListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalStoplists.value,
    }
  })

  const refetchData = () => {
    refStoplistListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, sendersFilter], () => {
    refetchData()
  })

  const fetchStoplists = (ctx, callback) => {
    isBusy.value = true
    store
      .dispatch('stoplists/fetchOrganisationStopList', {
        org_id: JSON.parse(JSON.stringify(Vue.$cookies.get('userData').membership.organisation_id)),
        q: searchQuery.value,
        per_page: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        sender: sendersFilter.value,
      })
      .then(response => {
        const { results, count } = response.data
        isBusy.value = false

        callback(results)
        totalStoplists.value = count
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching stoplists' list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }
  return {
    fetchStoplists,
    perPage,
    currentPage,
    totalStoplists,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refStoplistListTable,
    tableColumns,
    refetchData,
    isBusy,
    sendersFilter,
  }
}
