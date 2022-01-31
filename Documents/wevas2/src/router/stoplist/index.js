export default [
  {
    path: '/dnd-policies/stoplist',
    name: 'stoplist',
    component: () => import('@/views/stoplist/stop-list/StopList.vue'),
    meta: {
      pageTitle: 'DND Policies',
      breadcrumb: [
        {
          text: 'Stop List',
          active: true,
        },
      ],
    },
  },
]
