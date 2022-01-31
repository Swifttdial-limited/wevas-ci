import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchPayins(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/organisations/transactions', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
