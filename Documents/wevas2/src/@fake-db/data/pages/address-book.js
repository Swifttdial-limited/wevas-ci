// import mock from '@/@fake-db/mock'
// /* eslint-disable global-require */
// const data = {
//     "count": 3,
//     "next": null,
//     "previous": null,
//     "results": [
//       {
//         "name": "mtrack",
//         "description": null,
//         "data_fields": null,
//         "id": 1,
//         "parent_id": null,
//         "level": 0,
//         "lft": 0,
//         "rght": 0,
//         "tree_id": 0
//       },
//       {
//         "name": "sasa sms",
//         "description": "new group",
//         "data_fields": "",
//         "id": 2,
//         "parent_id": null,
//         "level": 0,
//         "lft": 0,
//         "rght": 1,
//         "tree_id": 0
//       },
//       {
//         "name": "qwertie",
//         "description": "new group under sasa",
//         "data_fields": "",
//         "id": 3,
//         "parent_id": 1,
//         "level": 1,
//         "lft": 1,
//         "rght": 0,
//         "tree_id": 1
//       }
//     ]
//   }
//   /* eslint-disable global-require */
//   const contacts = {
//     "count": 3,
//     "next": null,
//     "previous": null,
//     "results":[
//       {
//         phone_number: '254722912908', age: 40, first_name: 'Dickerson', last_name: 'Macdonald', Occupation: 'Job',
//       },
//       {
//         phone_number: '254722912908', age: 21, first_name: 'Larsen', last_name: 'Shaw', Occupation: 'Job',
//       },
//       {
//         phone_number: '254722912908', age: 89, first_name: 'Geneva', last_name: 'Wilson', Occupation: 'Bussiness',
//       },
//       {
//         phone_number: '254722912908', age: 38, first_name: 'Jami', last_name: 'Carney', Occupation: 'Bussiness',
//       },
//       {
//         phone_number: '254722912908', age: 40, first_name: 'James', last_name: 'Thomson', Occupation: 'Job',
//       },
//   ]
// }
// /* eslint-disable global-require */
// mock.onGet('/address-book/data').reply(() => [200, data])
// /* eslint-disable global-require */
// mock.onGet('/address-book/contacts').reply(() => [200, contacts])
