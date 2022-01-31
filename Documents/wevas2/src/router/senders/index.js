export default [
  {
    path: '/senders',
    name: 'senders',
    component: () => import('@/views/senders/senders-list/SendersList.vue'),
    meta: {
      pageTitle: 'Senders',
      breadcrumb: [
        {
          text: 'Senders List',
          active: true,
        },
      ],
    },
  },
  {
    path: '/senders-apply',
    name: 'senders-apply',
    component: () => import('@/views/senders/senders-list/ApplyNew.vue'),
    meta: {
      pageTitle: 'Senders',
      breadcrumb: [
        {
          text: 'Senders List',
          to: { name: 'senders' },
        },
        {
          text: 'Apply New',
          active: true,
        },
      ],
    },
  },
]
