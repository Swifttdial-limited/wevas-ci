import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchInboxList(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/inbox/', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchInbox(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`inbox/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
