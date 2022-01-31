import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
// import router from '@/router'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useContactsList(props) {
  const groupIdLocal = props.groupId
  // Use toast
  const toast = useToast()

  const refContactListTable = ref(null)
  const perPage = ref(5)
  const totalContacts = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const operatorFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refContactListTable.value ? refContactListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalContacts.value,
    }
  })

  const refetchData = () => {
    refContactListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, operatorFilter], () => {
    refetchData()
  })

  const fetchContacts = (ctx, callback) => {
    store
      .dispatch('address-books/fetchGroupContacts', {
        group: groupIdLocal,
        q: searchQuery.value,
        per_page: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        operator: operatorFilter.value,
      })
      .then(response => {
        const { results, count } = response.data

        callback(results)
        totalContacts.value = count
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching contacts' list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveContactTypeVariantAndIcon = type => {
    if (type === 'MSISDN') return { variant: 'success', icon: 'PhoneIcon' }
    if (type === 'EMAIL') return { variant: 'warning', icon: 'MailIcon' }
    return { variant: 'success', icon: 'PhoneIcon' }
  }

  const resolveClientAvatarVariant = type => {
    if (type === 'MSISDN') return 'success'
    if (type === 'EMAIL') return 'warning'
    return 'primary'
  }

  return {
    fetchContacts,
    perPage,
    currentPage,
    totalContacts,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refContactListTable,

    operatorFilter,

    resolveContactTypeVariantAndIcon,
    resolveClientAvatarVariant,

    refetchData,
  }
}
