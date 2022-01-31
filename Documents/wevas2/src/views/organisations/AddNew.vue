<template>
  <div>
    <form-wizard
      color="#7367F0"
      :title="null"
      :subtitle="null"
      shape="square"
      finish-button-text="Save"
      back-button-text="Previous"
      class="mb-3"
    >

      <!-- contact group and sender -->
      <tab-content
        title="Organisation Details"
        :before-change="validationFormOrgInfo"
      >
        <validation-observer
          ref="OrganisationInfoRules"
          tag="form"
        >
          <b-row>
            <b-col md="6">
                <b-form-group
                label="Name"
                label-for="name"
              >
              <validation-provider
                  #default="{ errors }"
                  name="Organisation Name"
                  rules="required"
                >
                  <b-form-input
                    id="name"
                    v-model="orgName"
                    placeholder="Name"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Organisation Name
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                 </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group
                label="Billing Email"
                label-for="billing-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Billing Email"
                  rules="required|email"
                >
                  <b-form-input
                    id="billing-email"
                    placeholder="johndoe@gmail.com"
                    v-model="billingEmail"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Billing Email
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
                <b-form-group
                label="Contact Phone"
                label-for="contact-phone"
              >
              <validation-provider
                  #default="{ errors }"
                  name="Contact Phone"
                  rules="required"
                >
                  <b-form-input
                    id="contact-phone"
                    v-model="contactPhone"
                    placeholder="2547000000"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Contact Phone
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                 </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group
                label="Address"
                label-for="address"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Address"
                  rules="required"
                >
                  <b-form-textarea
                    id="address"
                    v-model="address"
                    placeholder="Maruti Heights, Langata Link Road, Nairobi, Kenya"
                    rows="2"
                    no-resize
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Address
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>
    <tab-content
        title="Admin Details"
        :before-change="validationFormManagerInfo"
      >
        <validation-observer
          ref="OrganisationManagerRules"
          tag="form"
        >
          <b-row>
            <b-col md="6">
                <b-form-group
                label="First Name"
                label-for="first-name"
              >
              <validation-provider
                  #default="{ errors }"
                  name="First Name"
                  rules="required"
                >
                  <b-form-input
                    id="first-name"
                    v-model="managerFirstName"
                    placeholder="John"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  First Name
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                 </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group
                label="Last Name"
                label-for="last-name"
              >
              <validation-provider
                  #default="{ errors }"
                  name="Last Name"
                  rules="required"
                >
                  <b-form-input
                    id="last-name"
                    v-model="managerLastName"
                    placeholder="Doe"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Last Name
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                 </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
                <b-form-group
                label="Admin Email"
                label-for="manager-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Admin Email"
                  rules="required|email"
                >
                  <b-form-input
                    id="manager-email"
                    placeholder="johndoe@gmail.com"
                    v-model="managerEmail"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Admin Email
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group
                label="Admin Phone"
                label-for="manager-phone"
              >
              <validation-provider
                  #default="{ errors }"
                  name="Admin Phone"
                  rules=""
                >
                  <b-form-input
                    id="manager-phone"
                    v-model="managerPhone"
                    placeholder="2547000000"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Admin Phone
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                 </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>

      <!-- message and subject -->
      <tab-content
        title="Bulk Account"
        :before-change="validationFormBulkInfo"
      >
        <validation-observer
          ref="bulkAccountInfo"
          tag="form"
        >
          <b-row>
            <b-col md="3">
                <b-form-group
                label="Bulk Type"
                label-for="bulk-type"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Bulk Type"
                  rules=""
                >
                  <b-form-input
                    id="bulk-type"
                    placeholder="SMS"
                    :state="errors.length > 0 ? false:null"
                    disabled
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="3">
                <b-form-group
                label="Price"
                label-for="price"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Price"
                  rules="required"
                >
                  <b-form-input
                    type="number"
                    v-model="price"
                    id="price"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                 Cost for One Bulk Unit
                </small>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="3">
                <b-form-group
                label="Is Price Fixed?"
                label-for="is-price-fixed"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Is Price Fixed"
                  rules="required"
                >
                  <b-form-checkbox
                    v-model="isPriceFixed"
                    id="is-price-fixed"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                    Will this price be fixed?
                </small>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="3">
                <b-form-group
                label="Is Price Taxable?"
                label-for="is-price-taxable"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Is Price Taxable"
                  rules="required"
                >
                  <b-form-checkbox
                    v-model="isPriceTaxable"
                    id="is-price-taxable"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                    Will this price be Taxable?
                </small>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
          <!-- Spacer -->
          <hr class="invoice-spacing">
            <b-row>
               <b-col
              cols="12"
              class="mb-2"
            >
              <h5 class="mb-0 mt-1">
               Bulk credits
              </h5>
              <small class="text-muted">Specify SMS Credits per Message Type - Can be One of (Promotional, Transactional)</small>
            </b-col>
            <b-col md="3">
                <b-form-group
                label="Promotional / Campaigns"
                label-for="promotional-credits"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Promotional Credits"
                  rules=""
                >
                  <b-form-input
                    type="number"
                    v-model="promotionalCredits"
                    id="promotional-credits"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Used for Bulk Campaigns
                </small>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="3">
                <b-form-group
                label="Transactional / API"
                label-for="transactional-credits"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Transactional Credits"
                  rules=""
                >
                  <b-form-input
                    type="number"
                    v-model="transactionalCredits"
                    id="transactional-credits"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Used For API Messages
                </small>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>
    </form-wizard>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  // BButton,
  BFormInvalidFeedback,
  BFormTextarea,
  BFormCheckbox,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import { required, email } from '@validations'
import { codeIcon } from './code'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    // BButton,
    FormWizard,
    TabContent,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BFormTextarea,
    BFormCheckbox,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      codeIcon,
      required,
      email,
      billingEmail: 'joshuabuga@gmail.com',
      managerEmail: 'joshuabuga@gmail.com',
      contactPhone: '254722912908',
      orgName: 'Qwertie LTD',
      address: 'Maruti Heights',
      managerFirstName: 'Joshua',
      managerLastName: 'Abuga',
      managerPhone: '254722912908',
      transactionalCredits: 0,
      promotionalCredits: 0,
      price: 1,
      isPriceTaxable: true,
      isPriceFixed: false,
    }
  },
  methods: {
    validationFormOrgInfo() {
      return new Promise((resolve, reject) => {
        this.$refs.OrganisationInfoRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormManagerInfo() {
      return new Promise((resolve, reject) => {
        this.$refs.OrganisationManagerRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormBulkInfo() {
      return new Promise((resolve, reject) => {
        this.$refs.bulkAccountInfo.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormSocial() {
      return new Promise((resolve, reject) => {
        this.$refs.socialRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
  },
}
</script>
<style lang="scss">
  @import '@core/scss/vue/libs/vue-wizard.scss';
</style>
