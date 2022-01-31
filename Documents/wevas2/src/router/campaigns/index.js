export default [
// *===============================================---*
  // *--------- EMAIL & IT'S FILTERS N LABELS -------------------------------*
  // *===============================================---*
  {
    path: '/bulk-campaigns',
    name: 'bulk-campaigns',
    component: () => import('@/views/campaigns/Campaign.vue'),
    meta: {
      contentRenderer: 'sidebar-left',
      contentClass: 'email-application',
    },
  },
  {
    path: '/bulk/campaigns/:state',
    name: 'bulk-campaigns-state',
    component: () => import('@/views/campaigns/Campaign.vue'),
    meta: {
      contentRenderer: 'sidebar-left',
      contentClass: 'email-application',
      navActiveLink: 'bulk-campaigns',
    },
    beforeEnter(to, _, next) {
      if ([0, 1, 2, 3, 4, 5, 6, 7].includes(to.params.state)) next()
      else next({ name: 'error-404' })
    },
  },
  {
    path: '/bulk-campaigns/label/:label',
    name: 'apps-email-label',
    component: () => import('@/views/campaigns/Campaign.vue'),
    meta: {
      contentRenderer: 'sidebar-left',
      contentClass: 'email-application',
      navActiveLink: 'apps-email',
    },
    beforeEnter(to, _, next) {
      if ([0, 1, 2, 3, 4, 5].includes(to.params.state)) next()
      else next({ name: 'error-404' })
    },
  },
]
