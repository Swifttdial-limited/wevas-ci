export default [
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('@/views/payments/payins-list/PayinList.vue'),
    meta: {
      pageTitle: 'Bulk Topups',
      breadcrumb: [
        {
          text: 'Transactions',
          active: true,
        },
      ],
    },
  },
]
