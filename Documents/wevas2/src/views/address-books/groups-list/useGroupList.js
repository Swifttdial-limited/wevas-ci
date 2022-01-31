import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
import Vue from 'vue'
// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useGroupsList() {
  // Use toast
  const toast = useToast()
  const refGroupListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    // { key: 'id', label: '#', sortable: true },
    { key: 'name', sortable: true },
    { key: 'state_description', label: 'Status', sortable: true },
    // { key: 'description', sortable: true },
    // { key: 'custom_fields', sortable: true },
    { key: 'num_contacts', label: 'Number of Contacts', sortable: true },
    { key: 'created_at', label: 'Date Added', sortable: true },
    // { key: 'quick_to' },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalGroups = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const statusFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refGroupListTable.value ? refGroupListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalGroups.value,
    }
  })

  const refetchData = () => {
    refGroupListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, statusFilter], () => {
    refetchData()
  })

  const fetchGroups = (ctx, callback) => {
    store
      .dispatch('address-books/fetchGroups', {
        q: searchQuery.value,
        org_id: JSON.parse(JSON.stringify(Vue.$cookies.get('userData').membership.organisation_id)),
        per_page: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        status: statusFilter.value,
      })
      .then(response => {
        const { results, count } = response.data

        callback(results)
        totalGroups.value = count
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching groups' list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveGroupStatusVariantAndIcon = status => {
    if (status === 'Inactive') return { variant: 'warning', icon: 'PieChartIcon' }
    if (status === 'Active') return { variant: 'success', icon: 'CheckCircleIcon' }
    return { variant: 'secondary', icon: 'XIcon' }
  }

  const resolveClientAvatarVariant = status => {
    if (status === 'Partial Payment') return 'primary'
    if (status === 'Paid') return 'danger'
    if (status === 'Downloaded') return 'secondary'
    if (status === 'Draft') return 'warning'
    if (status === 'Sent') return 'info'
    if (status === 'Past Due') return 'success'
    return 'primary'
  }

  return {
    fetchGroups,
    tableColumns,
    perPage,
    currentPage,
    totalGroups,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refGroupListTable,
    // userData,

    statusFilter,

    resolveGroupStatusVariantAndIcon,
    resolveClientAvatarVariant,

    refetchData,
  }
}
