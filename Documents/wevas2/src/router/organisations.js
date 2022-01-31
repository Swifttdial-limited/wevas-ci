export default [
  {
    path: '/organisations/list',
    name: 'organisations-list',
    component: () => import('@/views/organisations/organisations-list/OrganisationList.vue'),
    meta: {
      pageTitle: 'Organisations',
      breadcrumb: [
        {
          text: 'Organisations',
          to: { name: 'organisations-list' },
        },
        {
          text: 'Organisation List',
          active: true,
        },
      ],
    },
  },
  {
    path: '/organisations/add-new',
    name: 'organisations-add-new',
    component: () => import('@/views/organisations/AddNew.vue'),
    meta: {
      pageTitle: 'Organisations',
      breadcrumb: [
        {
          text: 'Organisations',
          to: { name: 'organisations-list' },
        },
        {
          text: 'Add New Organisation',
          active: true,
        },
      ],
    },
  },
]
