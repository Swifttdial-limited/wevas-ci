import Vue from 'vue'

// axios
import axios from 'axios'

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  // baseURL: '/api/',
  // baseURL: 'http://dev.mtrack.localhost:8000/api/',
  baseURL: 'https://bulkdev.swifttdial.com:2778/api/',
  timeout: 9000,
  // headers: {'X-Custom-Header': 'foobar'}
})

Vue.prototype.$http = axiosIns

export default axiosIns
