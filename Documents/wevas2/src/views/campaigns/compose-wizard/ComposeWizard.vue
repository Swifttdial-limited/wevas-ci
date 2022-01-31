<template>
  <div>
    <form-wizard
      color="#7367F0"
      :title="null"
      :subtitle="null"
      shape="square"
      :finish-button-text="showSchedule ? 'Schedule Message' : 'Send Message'"
      back-button-text="Previous"
      class="mb-3"
      @on-complete="SubmitForm"
    >

      <!-- contact group and sender -->
      <tab-content
        title="Contact Group"
        :before-change="validationForm"
      >
        <validation-observer
          ref="accountRules"
          tag="form"
        >
          <b-row>
            <b-col md="6">
              <validation-provider
                #default="{ errors }"
                name="Sender"
                rules="required"
              >
                <b-form-group
                  label="From"
                  label-for="sender"
                  :state="errors.length > 0 ? false:null"
                >
                  <v-select
                    id="sender"
                    v-model="composeData.sender"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="senders"
                    :reduce="name => name.id"
                    @open="fetchSenders"
                    label="name"
                  />
                  <small class="text-muted">
                  Sender Name
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>
            <b-col md="6">
              <validation-provider
                #default="{ errors }"
                name="To"
                rules="required"
              >
                <b-form-group
                  label="To"
                  label-for="groups"
                  :state="errors.length > 0 ? false:null"
                >
                  <v-select
                    id="groups"
                    v-model="composeData.to"
                    multiple
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :options="groups"
                    label="name"
                  />
                  <small class="text-muted">
                  Contact Groups
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>

      <!-- message and subject -->
      <tab-content
        title="Message"
        :before-change="validationFormInfo"
      >
        <validation-observer
          ref="infoRules"
          tag="form"
        >
          <b-row>
            <b-col
              cols="12"
              class="mb-2"
            >
              <h5 class="mb-0">
                Type your message Below
              </h5>
              <small class="text-muted">Type your message below.Optionally provide a subject</small>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Subject"
                label-for="subject"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Subject"
                  rules=""
                >
                  <b-form-input
                    id="subject"
                    v-model="composeData.subject"
                    placeholder="Subject"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
          <div v-if="placeHolders.length > 0">
          <b-row>
            <b-col
              cols="12"
              class="mt-1"
            >
              <h5 class="mb-0">
                Place Holders:
              </h5>
            </b-col>
          </b-row>
          <ul
          id="my-custom-tags-list"
          class="list-unstyled d-inline-flex flex-wrap mb-0"
          aria-live="polite"
          aria-atomic="false"
          aria-relevant="additions removals"
        >
          <!-- Always use the tag value as the :key, not the index! -->
          <!-- Otherwise screen readers will not read the tag
             additions and removals correctly -->
          <b-card
            v-for="tag in placeHolders"
            :id="`my-custom-tags-tag_${tag.replace(/\s/g, '_')}_`"
            :key="tag"
            tag="li"
            class="shadow-none border mt-1 mr-1 mb-1"
            body-class="py-1 pr-2 text-nowrap"
          >
            <strong>{{ tag }}</strong>
            <b-button
              variant="link"
              size="sm"
              :aria-controls="`my-custom-tags-tag_${tag.replace(/\s/g, '_')}_`"
              class="py-0"
              @click="insertTag(tag)"
            >
              insert
            </b-button>
          </b-card>
        </ul>
          </div>
          <b-row>
            <b-col md="12">
              <validation-provider
                #default="{ errors }"
                name="Message"
                rules="required"
              >
                <b-form-group
                  label="Message"
                  label-for="message"
                  :state="errors.length > 0 ? false:null"
                >
                  <b-form-textarea
                    ref="refMessage"
                    id="message"
                    v-model="composeData.message"
                    placeholder="Message"
                    rows="8"
                    no-resize
                    :state="errors.length > 0 ? false:null"
                  />
                  <div
                  v-if="composeData.message!==undefined && composeData.message.length>0"
                  >
                    <b-alert show
                    class="mt-2 mb-2"
                    variant="dark"
                    >
                     <p class="m-2 mt-2 mb-2"> <small> Message Length: Includes <strong>STOP *456*9*5#</strong> Suffix</small>
                      <b-badge variant="secondary" class="ml-1">{{composeData.message.length + 14}}</b-badge>
                     </p>

                     </b-alert>
                  </div>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </validation-provider>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>

      <!-- preview and send  -->
      <tab-content
        title="Preview &amp; send"
        :before-change="validationFormAddress"
      >
        <validation-observer
          ref="addressRules"
          tag="form"
        >
          <b-row>
            <b-col
              cols="12"
              class="mb-2"
            >
              <h5 class="mb-0">
                Confirm Details
              </h5>
              <!-- <small class="text-muted">send or schedule your message</small> -->
            </b-col>
            <b-col md="12">
              <div v-if="composeData.subject!==undefined && composeData.subject.length >0">
                <h5 class="mb-2">Subject: <span class="text-muted">{{composeData.subject}}</span></h5>
              </div>
              <div class="mb-2">
                To: <span v-for="to in composeData.to" :key="to.id">
                  <span class="ml-1 text-muted">[ {{ to.name }} - {{ to.num_contacts }} ] </span>
                </span>
            </div>
             <div class="mb-2">
              Total Contacts:<span class="text-muted"> <b-badge variant="secondary" class="ml-1"> {{ numOfContacts }} </b-badge></span>
              </div>
              <div>
                <h5 class="mb-0">
                Message:
              </h5>
                <b-form-textarea id="textarea-plaintext" plaintext :value="composeData.message"
                  class="mb-2"
                  rows="4"
                  no-resize
                />
            </div>
            <div>
              <b-alert show class="p-2">
            <small>Approximately <b class="text-dark mx-auto"> {{ estimateUnits }} </b> SMS Credits will be used</small>
              </b-alert>
            </div>
            </b-col>
          </b-row>
        </validation-observer>
        <b-row class="mt-2 mb-2">
          <b-col md="12">
            <b-form-checkbox
              :checked="scheduleSwitchChecked"
              name="check-button"
              switch
              inline
              @change="toggleScheduleSwitch"
            >
            Schedule Message
          </b-form-checkbox>
          </b-col>
       </b-row>
      </tab-content>
    <div v-if="showSchedule">
      <b-row>
        <b-col md="6">
        <b-form-group>
          <h5>Date</h5>
          <flat-pickr
            v-model="composeData.sendAtDate"
            class="form-control"
            :config="{ altInput: true,altFormat: 'F j, Y', dateFormat: 'Y-m-d',}"
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
      <b-form-group>
        <h5>Time</h5>
        <flat-pickr
          v-model="composeData.sendAtTime"
          class="form-control"
          :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i', time_24hr: true }"
        />
      </b-form-group>
    </b-col>
      </b-row>
    </div>
    </form-wizard>

  </div>
</template>

<script>
import Vue from 'vue'
import { FormWizard, TabContent } from 'vue-form-wizard'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import Ripple from 'vue-ripple-directive'
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BFormTextarea,
  BAlert,
  BBadge,
  BFormCheckbox,
  BButton,
  BCard,
} from 'bootstrap-vue'

import {
  ref,
  onBeforeMount,
  computed,
} from '@vue/composition-api'

import store from '@/store'
import axios from '@axios'

// Notification
import { useToast } from 'vue-toastification/composition'
import { required } from '@validations'
import { codeIcon } from './code'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    FormWizard,
    TabContent,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BBadge,
    BAlert,
    vSelect,
    BFormInvalidFeedback,
    BFormCheckbox,
    BButton,
    BCard,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    flatPickr,
  },
  directives: {
    Ripple,
  },
  props: {
    to: {
      type: Object,
      required: false,
      default: null,
    },
  },
  setup(props, { emit }) {
    const toast = useToast()
    const blankComposeData = {
      sender: '',
      subject: '',
      message: '',
      to: Object.keys(props.to).length === 0 ? [] : [props.to],
      sendAtDate: null,
      sendAtTime: null,
    }
    const groups = ref([])
    const membership = JSON.parse(JSON.stringify(Vue.$cookies.get('userData').membership))
    const totalGroups = ref(0)
    const composeData = ref(JSON.parse(JSON.stringify(blankComposeData)))
    const resetComposeData = () => {
      composeData.value = JSON.parse(JSON.stringify(blankComposeData))
    }
    const fetchGroups = () => {
      store
        .dispatch('campaigns/fetchCampaignGroups', {
          org_id: membership.organisation_id,
        })
        .then(response => {
          const { results, count } = response.data
          totalGroups.value = count
          groups.value = results
        })
        .catch(() => {
          toast({
            component: ToastificationContent,
            props: {
              title: "Error fetching groups' list",
              icon: 'AlertTriangleIcon',
              variant: 'danger',
            },
          })
        })
    }
    const SubmitForm = () => {
      // composeData.value = {}
      const groupsObj = JSON.parse(JSON.stringify(composeData.value.to))
      const groupIds = []
      groupsObj.forEach(group => {
        groupIds.push(group.id)
      })
      const postData = {
        message: composeData.value.message,
        subject: composeData.value.subject,
        groups: groupIds,
        sender: composeData.value.sender,
        sendAtDate: composeData.value.sendAtDate,
        sendAtTime: composeData.value.sendAtTime,
        org_id: membership.organisation_id,
      }
      axios.post('/campaigns/create', postData).then(res => {
        console.log(res.data)
        resetComposeData()
        // composeData.value = {}
        emit('close-compose-modal')
      })
        .catch(res => {
          console.log('ERROR OCCURED', res)
        })
    }
    // eslint-disable-next-line arrow-body-style
    const estimateUnits = computed(() => {
      if (composeData.value.to.length > 0 && composeData.value.to !== undefined) {
        const msgLength = composeData.value.message.length + 14
        return composeData.value.to.reduce((tt, to) => tt + to.num_contacts, 0) * (Math.ceil(msgLength / 160))
      }
      return 0
    })
    const numOfContacts = computed(() => {
      if (composeData.value.to.length > 0 && composeData.value.to !== undefined) {
        return composeData.value.to.reduce((tt, to) => tt + to.num_contacts, 0)
      }
      return 0
    })
    const placeHolders = computed(() => {
      if (composeData.value.to.length > 0 && composeData.value.to !== undefined) {
        return composeData.value.to.reduce((tt, to) => tt.concat(to.custom_fields), [])
      }
      return []
    })
    onBeforeMount(fetchGroups)
    return {
      composeData,
      resetComposeData,
      groups,
      fetchGroups,
      estimateUnits,
      numOfContacts,
      SubmitForm,
      placeHolders,
    }
  },
  data() {
    return {
      scheduleSwitchChecked: false,
      showSchedule: false,
      required,
      codeIcon,
      senders: [],
    }
  },
  methods: {
    insertTag(tag) {
      const tArea = this.$refs.refMessage
      // get cursor's position:
      const startPos = tArea.selectionStart
      const endPos = tArea.selectionEnd
      let cursorPos = startPos
      const tmpStr = tArea.value
      // filter:
      if (tag === 0) {
        return
      }
      if (cursorPos === -1) {
        return
      }
      // insert:
      this.composeData.message = `${tmpStr.substring(0, startPos)}{${tag}}${tmpStr.substring(endPos, tmpStr.length)}`

      // move cursor:
      setTimeout(() => {
        cursorPos += tag.length
        tArea.selectionStart = tArea.selectionEnd
      }, 10)
    },
    fetchSenders() {
      store
        .dispatch('campaigns/fetchOrganisationSenders', {
          orgId: JSON.parse(JSON.stringify(this.$cookies.get('userData').membership.organisation_id)),
          type: 1,
          is_active: true,
        })
        .then(response => {
          this.senders = response.data.results
        })
        .catch(response => {
          console.log(response)
        })
    },
    toggleScheduleSwitch() {
      this.showSchedule = !this.showSchedule
    },
    validationForm() {
      return new Promise((resolve, reject) => {
        this.$refs.accountRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormInfo() {
      return new Promise((resolve, reject) => {
        this.$refs.infoRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormAddress() {
      return new Promise((resolve, reject) => {
        this.$refs.addressRules.validate().then(success => {
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
  @import '@core/scss/vue/libs/vue-select.scss';
  @import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
