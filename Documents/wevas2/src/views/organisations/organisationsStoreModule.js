import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchOrganisationsList(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/organisations/list', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchOrganisation(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/organisation/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
