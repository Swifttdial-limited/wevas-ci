import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
// import router from '@/router'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useOrganisationList() {
  // Use toast
  const toast = useToast()

  const refOrganisationListTable = ref(null)
  // Table Handlers
  const tableColumns = [
    // { key: 'campaign', sortable: true },
    { key: 'name', sortable: true },
    { key: 'manager', label: 'Admin', sortable: true },
    { key: 'billing_email', sortable: true },
    { key: 'contact_phone', sortable: true },
    { key: 'address', sortable: true },
    { key: 'promotional_credits', sortable: true },
    { key: 'transactional_credits', sortable: true },
    { key: 'created_at', label: 'Joined On', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalOrganisations = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const statusFilter = ref(null)
  const isBusy = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refOrganisationListTable.value ? refOrganisationListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalOrganisations.value,
    }
  })

  const refetchData = () => {
    refOrganisationListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, statusFilter], () => {
    refetchData()
  })

  const fetchOrganisations = (ctx, callback) => {
    isBusy.value = true
    store
      .dispatch('organisations/fetchOrganisationsList', {
        q: searchQuery.value,
        per_page: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        state: statusFilter.value,
      })
      .then(response => {
        const { results, count } = response.data
        isBusy.value = false

        callback(results)
        totalOrganisations.value = count
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching organisations' list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveOrganisationStatusVariantAndIcon = state => {
    if (state === 'SENT') return { variant: 'info', icon: 'PhoneIcon' }
    if (state === 'DELIVERED') return { variant: 'warning', icon: 'MailIcon' }
    return { variant: 'success', icon: 'PhoneIcon' }
  }
  const resolveOrganisationStatusVariant = state => {
    if (state === 'SENT') return { variant: 'info' }
    if (state === 'DELIVERED') return { variant: 'success' }
    if (state === 'ERRORED') return { variant: 'danger' }
    if (state === 'UNDELIVERED') return { variant: 'warning' }
    if (state === 'QUEUED') return { variant: 'secondary' }
    if (state === 'WAITING') return { variant: 'dark' }
    return { variant: 'primary' }
  }

  return {
    fetchOrganisations,
    perPage,
    currentPage,
    totalOrganisations,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refOrganisationListTable,

    statusFilter,
    tableColumns,

    resolveOrganisationStatusVariantAndIcon,
    resolveOrganisationStatusVariant,
    refetchData,
    isBusy,
  }
}
