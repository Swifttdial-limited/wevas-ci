export default [
  {
    path: '/api-keys',
    name: 'api-keys',
    component: () => import('@/views/apikeys/apikeys-list/ApiKeysList.vue'),
    meta: {
      pageTitle: 'API Settings',
      breadcrumb: [
        {
          text: 'Security',
          active: true,
        },
        {
          text: 'API Keys',
          active: true,
        },
      ],
    },
  },
]
