import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchOutboxList(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/outbox/', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchOutbox(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`outbox/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
