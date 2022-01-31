import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    // fetchOrganisationSenders(ctx, { params: queryParams }) {
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .get(`/organisations/${params.orgId}/senders`, { params: queryParams })
    //       .then(response => resolve(response))
    //       .catch(error => reject(error))
    //   })
    // },
    fetchOrganisationSenders(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/organisations/${queryParams.orgId}/senders`, { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
