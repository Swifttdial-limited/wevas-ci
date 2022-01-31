export default [
  {
    path: '/outbox',
    name: 'outbox',
    component: () => import('@/views/outbox/outbox-list/OutboxList.vue'),
    meta: {
      pageTitle: 'Message Outbox',
      breadcrumb: [
        {
          text: 'Bulk Outbox',
          active: true,
        },
      ],
    },
  },
  {
    path: '/api-outbox',
    name: 'api-outbox',
    component: () => import('@/views/outbox/outbox-list/ApiOutboxList.vue'),
    meta: {
      pageTitle: 'Message Outbox',
      breadcrumb: [
        {
          text: 'API Outbox',
          active: true,
        },
      ],
    },
  },
]
