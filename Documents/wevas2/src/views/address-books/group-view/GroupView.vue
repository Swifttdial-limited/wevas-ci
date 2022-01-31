<template>
  <section class="invoice-preview-wrapper">

    <!-- Alert: No item found -->
    <b-alert
      variant="danger"
      :show="groupData === undefined"
    >
      <h4 class="alert-heading">
        Error fetching group data
      </h4>
      <div class="alert-body">
        No group found with this group id. Check
        <b-link
          class="alert-link"
          :to="{ name: 'apps-group-list'}"
        >
          Group List
        </b-link>
        for other groups.
      </div>
    </b-alert>

    <b-row
      v-if="groupData"
      class="invoice-preview"
    >

      <!-- Col: Left (Group Container) -->
      <b-col
        cols="12"
        xl="9"
        md="8"
      >
        <b-card
          no-body
          class="invoice-preview-card"
        >
          <!-- Header -->
          <b-card-body class="invoice-padding pb-2">

            <div class="d-flex justify-content-between flex-md-row flex-column group-spacing mt-0">

              <!-- Header: Left Content -->
              <div>
                <div class="logo-wrapper">
                  <h3 class="text-secondary group-logo"
                  style="text-transform: capitalize;"
                  >
                    {{ groupData.name }}
                  </h3>
                </div>
                <p class="card-text mb-2">
                  Description: {{ groupData.description }}
                </p>
                <p class="card-text mb-2">
                 Type: {{ groupData.type_description }}
                </p>
                <p class="card-text mb-2">
                  Status:
                  <b-badge
                    class=""
                    pill
                    variant="light-success"
                    >
                   {{groupData.state_description }}
                    </b-badge>
                </p>
              <div v-if="groupData.operators.length >=1">
              <span class="">Contacts by Operator</span>
              <b-button
              class="ml-2"
               v-for="item in groupData.operators"
               :key="item.operator"
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                :variant="`flat-${resolveGroupOperatorVariantAndIcon(item.operator)}`"
              >
                {{item.operator}} <span class="ml-1">{{item.count}}</span>
              </b-button>
              </div>
              </div>

              <!-- Header: Right Content -->
              <div class="mt-md-0 mt-2">
                <h4 class="invoice-title">
                  Group
                  <span class="invoice-number">#{{ groupData.id }}</span>
                </h4>
                <div class="invoice-date-wrapper">
                  <p class="invoice-date-title mb-2">
                    Date Created:
                  </p>
                  <p class="invoice-date mb-2">
                    {{ groupData.created_at }}
                  </p>
                </div>
                <div class="invoice-date-wrapper">
                  <p class="invoice-date-title">
                    All Contacts
                  </p>
                  <p class="invoice-date">
                    <b-badge
                    class=""
                    pill
                    variant="secondary"
                    >
                    {{ groupData.num_contacts }}
                    </b-badge>
                  </p>
                </div>
              </div>
            </div>
          </b-card-body>
        </b-card>

      </b-col>

      <!-- Right Col: Card -->
      <b-col
        cols="12"
        md="4"
        xl="3"
        class="invoice-actions"
      >
        <b-card class="border-primary mt-0">
           <!-- Button: Send Group -->
          <h5 class="mb-1 text-secondary">Upload Contacts File (.csv, .xlsx)</h5>
          <el-upload
          ref="upload"
          action=""
          :auto-upload="false"
          :http-request="uploadFile"
          :drag="true"
          :on-success="onSuccess"
          :thumbnail-mode="true"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :multiple="false"
          :before-remove="beforeRemove">
          <p class="mt-4">Select or Drop Files to Upload</p>
          </el-upload>
          <div class="d-flex justify-content-center mt-1">
          <b-button
            variant="success"
            @click="submitUpload"
          >
          Upload Contacts
          </b-button>
          </div>
        </b-card>
      </b-col>
    </b-row>
     <!-- Spacer -->
          <hr class="invoice-spacing">
    <b-row>
      <b-col
        cols="12"
        xl="12"
        md="12"
      >
      <h4 class="card-title">Group Contacts</h4>
      <b-card
          no-body
          class="invoice-preview-card"
        >
          <!-- Header -->
          <b-card-body v-if="groupData != undefined">
            <contact-list :group-id="groupData.id" />
          </b-card-body>
      </b-card>

      </b-col>
    </b-row>
  </section>
</template>

<script>
import { ref, onUnmounted } from '@vue/composition-api'
import store from '@/store'
import router from '@/router'
import axios from '@axios'
import {
  BRow,
  BCol,
  BCard,
  BCardBody,
  BAlert,
  BLink,
  VBToggle,
  BBadge,
  BButton,
  // BTableLite,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import addressBookStoreModule from '../addressBookStoreModule'
import ContactList from '../contacts-list/ContactList.vue'
// import GroupSidebarSendGroup from '../GroupSidebarSendGroup.vue'
// import GroupSidebarAddPayment from '../GroupSidebarAddPayment.vue'

export default {
  directives: {
    Ripple,
    'b-toggle': VBToggle,
  },
  components: {
    ContactList,
    BRow,
    BCol,
    BCard,
    BCardBody,
    // BTable,
    // BTableLite,
    // BCardText,
    // BButton,
    BBadge,
    BAlert,
    BLink,
    BButton,
    // GroupSidebarAddPayment,
    // GroupSidebarSendGroup,
  },
  setup() {
    const groupData = ref(null)

    const ADDRESS_BOOK_STORE_MODULE_NAME = 'address-books'

    const resolveGroupOperatorVariantAndIcon = operator => {
      if (operator === 'Safaricom') return 'primary'
      if (operator === 'Airtel') return 'danger'
      if (operator === 'Telkom') return 'info'
      if (operator === 'Finserve') return 'warning'
      return 'primary'
    }

    // Register module
    if (!store.hasModule(ADDRESS_BOOK_STORE_MODULE_NAME)) store.registerModule(ADDRESS_BOOK_STORE_MODULE_NAME, addressBookStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(ADDRESS_BOOK_STORE_MODULE_NAME)) store.unregisterModule(ADDRESS_BOOK_STORE_MODULE_NAME)
    })

    store.dispatch('address-books/fetchGroup', { id: router.currentRoute.params.id })
      .then(response => {
        groupData.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          groupData.value = undefined
        }
      })

    return {
      groupData,
      resolveGroupOperatorVariantAndIcon,
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`)
    },
    beforeRemove(file, fileList) {
      console.log(file, fileList)
      return this.$confirm(`Cancel the transfert of ${file.name} ?`)
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    onSuccess() {
      store.dispatch('address-books/fetchGroup', { id: router.currentRoute.params.id })
        .then(response => {
          this.groupData = response.data
          this.$root.$emit('bv::refresh::table', 'contact-list-table')
        })
        .catch(error => {
          if (error.response.status === 404) {
            this.groupData = undefined
          }
        })
    },
    async uploadFile(params) {
      const form = new FormData()
      form.append('file', params.file)
      await axios.post(`/address-books/${this.groupData.id}/add-contacts`, form)
    },
  },
}
</script>
<style lang="css">
@import "~@/assets/css/element-ui/theme/index.css";
</style>
<style lang="scss" scoped>
@import "~@core/scss/base/pages/app-invoice.scss";
</style>

<style lang="scss">
@media print {

  // Global Styles
  body {
    background-color: transparent !important;
  }
  nav.header-navbar {
    display: none;
  }
  .main-menu {
    display: none;
  }
  .header-navbar-shadow {
    display: none !important;
  }
  .content.app-content {
    margin-left: 0;
    padding-top: 2rem !important;
  }
  footer.footer {
    display: none;
  }
  .card {
    background-color: transparent;
    box-shadow: none;
  }
  .customizer-toggle {
    display: none !important;
  }

  // Group Specific Styles
  .group-preview-wrapper {
    .row.group-preview {
      .col-md-8 {
        max-width: 100%;
        flex-grow: 1;
      }

      .group-preview-card {
        .card-body:nth-of-type(2) {
          .row {
              > .col-12 {
              max-width: 50% !important;
            }

            .col-12:nth-child(2) {
              display: flex;
              align-items: flex-start;
              justify-content: flex-end;
              margin-top: 0 !important;
            }
          }
        }
      }
    }

    // Action Right Col
    .group-actions {
      display: none;
    }
  }
}
</style>
