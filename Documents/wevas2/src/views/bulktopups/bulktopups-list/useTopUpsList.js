import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
import Vue from 'vue'
// import router from '@/router'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useTopUpList() {
  // Use toast
  const toast = useToast()

  const refTopupListTable = ref(null)
  // Table Handlers
  const tableColumns = [
    { key: 'account_type_label', label: 'Sub Account Credited', sortable: true },
    { key: 'credits', label: 'Units Credited', sortable: true },
    { key: 'payment_method_label', label: 'Payment Method', sortable: true },
    { key: 'payment_ref', label: 'Payment Reference', sortable: true },
    { key: 'created_at', label: 'Credited On', sortable: true },
    // { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalTopuplists = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const typeFilter = ref(null)
  const isSortDirDesc = ref(true)
  const isBusy = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refTopupListTable.value ? refTopupListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalTopuplists.value,
    }
  })

  const refetchData = () => {
    refTopupListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, typeFilter], () => {
    refetchData()
  })

  const fetchTopuplists = (ctx, callback) => {
    isBusy.value = true
    store
      .dispatch('bulktopups/fetchOrganisationBulkTopUps', {
        org_id: JSON.parse(JSON.stringify(Vue.$cookies.get('userData').membership.organisation_id)),
        q: searchQuery.value,
        per_page: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        type: typeFilter.value,
      })
      .then(response => {
        const { results, count } = response.data
        isBusy.value = false

        callback(results)
        totalTopuplists.value = count
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching topuplists' list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }
  return {
    fetchTopuplists,
    perPage,
    currentPage,
    totalTopuplists,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refTopupListTable,
    tableColumns,
    refetchData,
    isBusy,
    typeFilter,
  }
}
