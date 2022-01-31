import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchReport(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get('/stats/delivery-report', { params: payload })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
