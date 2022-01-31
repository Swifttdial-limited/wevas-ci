export default [
  {
    header: 'Bulk Campaigns',
  },
  {
    title: 'Campaigns',
    icon: 'MessageCircleIcon',
    children: [
      {
        title: 'SMS',
        route: 'bulk-campaigns',
      },
      {
        title: 'Email',
        route: { name: 'misc-coming-soon' },
        tag: 'Soon',
        tagVariant: 'light-warning',
        icon: 'AlertOctagonIcon',
      },
      {
        title: 'Whatsapp',
        route: { name: 'misc-coming-soon' },
        tag: 'Soon',
        tagVariant: 'light-warning',
        icon: 'AlertOctagonIcon',
      },
    ],
  },
]
