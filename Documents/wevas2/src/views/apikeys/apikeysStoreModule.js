import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchOrganisationApiKeys(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/organisations/api-keys/${queryParams.org_id}`, { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addNewApiKey(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post('/organisations/create-api-keys', payload)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
