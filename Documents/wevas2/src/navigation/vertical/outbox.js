export default [
  {
    header: 'Message Outbox',
  },
  {
    title: 'Outbox',
    icon: 'LogOutIcon',
    children: [
      {
        title: 'Bulk Outbox',
        route: 'outbox',
      },
      {
        title: 'API Outbox',
        route: { name: 'api-outbox' },
      },
    ],
  },
]
