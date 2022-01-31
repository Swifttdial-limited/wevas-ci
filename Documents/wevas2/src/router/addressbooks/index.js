export default [
  {
    path: '/address-books/groups',
    name: 'address-books-groups',
    component: () => import('@/views/address-books/groups-list/GroupList.vue'),
    meta: {
      pageTitle: 'Address Books',
      breadcrumb: [
        {
          text: 'Contact Groups',
          active: true,
        },
      ],
    },
  },
  {
    path: '/address-books:group/contacts',
    name: 'contacts',
    component: () => import('@/views/address-books/contacts-list/ContactList.vue'),
  },
  {
    path: '/address-books/groups/:id',
    name: 'address-books-group-view',
    component: () => import('@/views/address-books/group-view/GroupView.vue'),
    meta: {
      pageTitle: 'Address Books',
      breadcrumb: [
        {
          text: 'Contact Groups',
          to: { name: 'address-books-groups' },
        },
        {
          text: 'View Group Details',
          active: true,
        },
      ],
    },
  },
  {
    path: '/address-books/groups/manage/:id',
    name: 'address-books-group-manage-contacts',
    component: () => import('@/views/address-books/group-manage-contacts/GroupManageContacts.vue'),
  },
]
