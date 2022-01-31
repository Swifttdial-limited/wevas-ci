import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchCampaigns(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get('/campaigns/list', { params: payload })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchCampaignGroups(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get('/address-books/groups', { params: payload })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteCampaigns(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post('/campaigns/archive', payload)
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
    fetchOrganisationSenders(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/organisations/${queryParams.orgId}/senders`, { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchCampaign(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`campaigns/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    getCampaignProgress(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`campaigns/${id}/progress`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    stopCampaign(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`campaigns/${id}/stop`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    // updateEmailLabels(ctx, payload) {
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .post('/apps/email/update-emails-label', payload)
    //       .then(response => resolve(response))
    //       .catch(error => reject(error))
    //   })
    // },
    // paginateCampaign(ctx, payload) {
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .get('/apps/email/paginate-email', { params: payload })
    //       .then(response => resolve(response))
    //       .catch(error => reject(error))
    //   })
    // },
  },
}
