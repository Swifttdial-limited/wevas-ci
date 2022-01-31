import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
import Vue from 'vue'
// import router from '@/router'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useApiKeysList() {
  // Use toast
  const toast = useToast()

  const refApiKeyListTable = ref(null)
  // Table Handlers
  const tableColumns = [
    { key: 'name', label: 'App Name', sortable: true },
    { key: 'api_key_encoded', label: 'Api Key ( X-API-Key ) ', sortable: true },
    { key: 'created_at', label: 'Credited On', sortable: true },
    // { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalApiKeyList = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const typeFilter = ref(null)
  const isSortDirDesc = ref(true)
  const isBusy = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refApiKeyListTable.value ? refApiKeyListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalApiKeyList.value,
    }
  })

  const refetchData = () => {
    refApiKeyListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, typeFilter], () => {
    refetchData()
  })

  const fetchApiKeyList = (ctx, callback) => {
    isBusy.value = true
    store
      .dispatch('apikeys/fetchOrganisationApiKeys', {
        org_id: JSON.parse(JSON.stringify(Vue.$cookies.get('userData').membership.organisation_id)),
        q: searchQuery.value,
        per_page: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
      })
      .then(response => {
        const { results, count } = response.data
        isBusy.value = false

        callback(results)
        totalApiKeyList.value = count
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
    fetchApiKeyList,
    perPage,
    currentPage,
    totalApiKeyList,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refApiKeyListTable,
    tableColumns,
    refetchData,
    isBusy,
    typeFilter,
  }
}
