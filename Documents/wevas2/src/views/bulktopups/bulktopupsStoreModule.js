import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchOrganisationBulkTopUps(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/organisations/bulk-topups', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
