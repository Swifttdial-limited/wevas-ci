import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchOrganisationStopList(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/dnd-policies/stop-list', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchOrganisationSenders(ctx, { orgId }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/organisations/${orgId}/senders`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
