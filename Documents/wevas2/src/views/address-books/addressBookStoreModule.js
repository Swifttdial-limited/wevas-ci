import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchGroups(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/address-books/groups', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchGroupContacts(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/address-books/${queryParams.group}/contacts`, { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchGroup(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`address-books/group/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addGroup(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post('/address-books/groups/add', payload)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
