import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
import Vue from 'vue'
// import router from '@/router'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useSendersList() {
  // Use toast
  const toast = useToast()

  const refSenderListTable = ref(null)
  // Table Handlers
  const tableColumns = [
    // { key: 'campaign', sortable: true },
    { key: 'name', sortable: true },
    { key: 'code', label: 'Profile Code', sortable: true },
    { key: 'type_name', label: 'Type', sortable: true },
    { key: 'status', sortable: true },
    { key: 'created_at', label: 'Assigned On', sortable: true },
    // { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalSenders = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const typeFilter = ref(null)
  const isBusy = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refSenderListTable.value ? refSenderListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalSenders.value,
    }
  })

  const refetchData = () => {
    refSenderListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, typeFilter], () => {
    refetchData()
  })

  const fetchSenders = (ctx, callback) => {
    isBusy.value = true
    store
      .dispatch('senders/fetchOrganisationSenders', {
        orgId: JSON.parse(JSON.stringify(Vue.$cookies.get('userData').membership.organisation_id)),
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
        totalSenders.value = count
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching senders' list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveSenderTypeVariantAndIcon = type => {
    if (type === 'Promotional') return { variant: 'success', icon: 'PhoneIcon' }
    if (type === 'Transactional') return { variant: 'warning', icon: 'MailIcon' }
    return { variant: 'success', icon: 'PhoneIcon' }
  }
  const resolveSenderStatusVariantAndIcon = type => {
    if (type === 'Active') return { variant: 'success', icon: 'PhoneIcon' }
    if (type === 'Deactivated') return { variant: 'danger', icon: 'MailIcon' }
    return { variant: 'success', icon: 'PhoneIcon' }
  }
  return {
    fetchSenders,
    perPage,
    currentPage,
    totalSenders,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refSenderListTable,

    typeFilter,
    tableColumns,

    resolveSenderTypeVariantAndIcon,
    resolveSenderStatusVariantAndIcon,
    refetchData,
    isBusy,
  }
}
