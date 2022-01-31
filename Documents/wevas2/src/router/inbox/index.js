export default [
  {
    path: '/inbox',
    name: 'inbox',
    component: () => import('@/views/inbox/inbox-list/InboxList.vue'),
    meta: {
      pageTitle: 'Short Codes',
      breadcrumb: [
        {
          text: 'Inbox',
          active: true,
        },
      ],
    },
  },
]
