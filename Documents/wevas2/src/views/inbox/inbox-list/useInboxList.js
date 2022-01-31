import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
import Vue from 'vue'
// import router from '@/router'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useApiInboxList() {
  // Use toast
  const toast = useToast()

  const refInboxListTable = ref(null)
  // Table Handlers
  const tableColumns = [
    // { key: 'campaign', sortable: true },
    { key: 'sender', label: 'Short Code', sortable: true },
    { key: 'type_label', label: 'Type', sortable: true },
    { key: 'recipient', sortable: true },
    { key: 'message', sortable: true },
    { key: 'replied', label: 'Is Replied', sortable: true },
    { key: 'created_at', label: 'Sent At', sortable: true },
    { key: 'show_details', label: 'Actions' },
    // { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalInbox = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const statusFilter = ref(null)
  const isBusy = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refInboxListTable.value ? refInboxListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalInbox.value,
    }
  })

  const refetchData = () => {
    refInboxListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, statusFilter], () => {
    refetchData()
  })

  const fetchInbox = (ctx, callback) => {
    isBusy.value = true
    store
      .dispatch('inbox/fetchInboxList', {
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
        totalInbox.value = count
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching inboxs' list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveInboxStatusVariantAndIcon = replied => {
    if (replied === 'Yes') return { variant: 'success', icon: 'PhoneIcon' }
    if (replied === 'No') return { variant: 'warning', icon: 'PhoneIcon' }
    return { variant: 'success', icon: 'PhoneIcon' }
  }
  const resolveInboxStatusVariant = replied => {
    if (replied === 'Yes') return { variant: 'success' }
    if (replied === 'No') return { variant: 'secondary' }
    return { variant: 'secondary' }
  }
  const resolveInboxSenderTypeVariant = type => {
    if (type === 'MO') return { variant: 'dark' }
    if (type === 'SUBSCRIPTION') return { variant: 'secondary' }
    return { variant: 'secondary' }
  }

  return {
    fetchInbox,
    perPage,
    currentPage,
    totalInbox,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refInboxListTable,

    statusFilter,
    tableColumns,

    resolveInboxStatusVariantAndIcon,
    resolveInboxStatusVariant,
    resolveInboxSenderTypeVariant,
    refetchData,
    isBusy,
  }
}
