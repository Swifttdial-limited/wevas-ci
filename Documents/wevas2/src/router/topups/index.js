export default [
  {
    path: '/bulk-topups',
    name: 'bulk-topups',
    component: () => import('@/views/bulktopups/bulktopups-list/TopUpsList.vue'),
    meta: {
      pageTitle: 'Bulk Topups',
      breadcrumb: [
        {
          text: 'Bulk Topups List',
          active: true,
        },
      ],
    },
  },
]
