<template>
  <b-modal
    id="compose-mail"
    :visible="shallShowEmailComposeModal"
    title="Compose Email"
    modal-class="modal-sticky"
    footer-class="d-flex justify-content-between"
    body-class="p-0"
    size="lg"
    no-fade
    hide-backdrop
    static
    @change="(val) => $emit('update:shall-show-email-compose-modal', val)"
  >
    <!-- Modal Header -->
    <template #modal-header>
      <h5 class="modal-title">
        Compose Message
      </h5>
      <div class="modal-actions">
        <feather-icon
          icon="MinusIcon"
          class="cursor-pointer"
          @click="$emit('update:shall-show-email-compose-modal', false)"
        />
        <feather-icon
          icon="Maximize2Icon"
          class="ml-1 cursor-pointer"
        />
        <feather-icon
          icon="XIcon"
          class="ml-1 cursor-pointer"
          @click="discardMessage"
        />
      </div>
    </template>

    <!-- Modal Footer -->
    <template #modal-footer>
      <!-- Footer: Left Content -->
      <div>
        <b-dropdown
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          split
          text="Send"
          variant="primary"
          right
          @click="sendMessage"
        >
          <b-dropdown-item>
            Schedule Send
          </b-dropdown-item>
        </b-dropdown>
        <feather-icon
          icon="PaperclipIcon"
          size="17"
          class="ml-2 cursor-pointer"
        />
      </div>

      <!-- Footer: Right Content -->
      <div>

        <!-- Dropdown: More Actions -->
        <b-dropdown
          variant="link"
          no-caret
          toggle-class="p-0"
          right
        >
          <template #button-content>
            <feather-icon
              icon="MoreVerticalIcon"
              size="17"
              class="text-body"
            />
          </template>

          <b-dropdown-item>
            Add Label
          </b-dropdown-item>

          <b-dropdown-item>
            Plain Text Mode
          </b-dropdown-item>

          <b-dropdown-divider />

          <b-dropdown-item>
            Print
          </b-dropdown-item>
          <b-dropdown-item>
            Check Spelling
          </b-dropdown-item>
        </b-dropdown>

        <!-- Discard Compose -->
        <feather-icon
          icon="TrashIcon"
          size="17"
          class="ml-75 cursor-pointer"
          @click="discardMessage"
        />
      </div>
    </template>

    <!-- Modal: Body -->
    <b-form>

      <!-- Field: To -->
      <div class="compose-mail-form-field">
        <label
          for="email-to"
          class="form-label"
        >To: </label>
        <v-select
          v-model="composeData.to"
          :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
          multiple
          label="name"
          class="flex-grow-1 email-to-selector"
          :options="groups"
          input-id="email-to"
        >
          <template #option="{ name }">
            <span class="ml-50"> {{ name }}</span>
          </template>

          <template #selected-option="{ name }">
            <span class="ml-50"> {{ name }}</span>
          </template>
        </v-select>
      </div>
      <!-- Field: Subject -->
      <div class="compose-mail-form-field">
        <label for="email-subject">Subject: </label>
        <b-form-input
          id="email-subject"
          v-model="composeData.subject"
        />
      </div>

      <!-- Field: Message - Quill Editor -->
      <div class="message-editor">
        <b-form-textarea
          v-model="composeData.message"
           id="compose-textarea"
          class="mt-2"
          placeholder="Message Opt Out option '*456*95#' Included."
          rows="10"
          no-resize
        />
      </div>
    </b-form>

  </b-modal>
</template>

<script>
import {
  BDropdown, BDropdownItem, BForm, BFormInput, BDropdownDivider, BFormTextarea,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { ref } from '@vue/composition-api'
import vSelect from 'vue-select'
import axios from '@axios'

export default {
  directives: {
    Ripple,
  },
  components: {

    // BSV
    BDropdown,
    BDropdownItem,
    BForm,
    BFormInput,
    BDropdownDivider,
    BFormTextarea,

    // 3rd Party
    vSelect,
  },
  model: {
    prop: 'shallShowEmailComposeModal',
    event: 'update:shall-show-email-compose-modal',
  },
  props: {
    shallShowEmailComposeModal: {
      type: Boolean,
      required: true,
    },
  },
  setup(_, { emit }) {
    const composeData = ref({})
    /* eslint-enable global-require */
    const sendMessage = () => {
      // composeData.value = {}
      emit('update:shall-show-email-compose-modal', false)
      const groups = JSON.parse(JSON.stringify(composeData.value.to))
      const groupIds = []
      groups.forEach(group => {
        groupIds.push(group.id)
      })
      const postData = {
        message: composeData.value.message,
        subject: composeData.value.subject,
        groups: groupIds,
      }
      axios.post('/campaigns/create', postData).then(res => {
        console.log('SENT', res.data)
        composeData.value = {}
      })
        .catch(res => {
          console.log('ERROR OCCURED', res.data)
        })
    }

    const discardMessage = () => {
      composeData.value = {}
      emit('update:shall-show-email-compose-modal', false)
    }

    return {
      composeData,
      // Campaign actions
      sendMessage,
      discardMessage,
    }
  },
  data() {
    return {
      groups: [],
    }
  },
  mounted() {
    this.$http.get('/address-books/groups').then(res => { this.groups = JSON.parse(JSON.stringify(res.data.results)) })
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/quill.scss';
</style>

<style lang="scss" scoped>
form ::v-deep {

  // Mail To vue-select style
  .v-select {
    .vs__dropdown-toggle {
      border: 0;
      box-shadow: none;
    }
    .vs__open-indicator {
      display: none;
    }
  }
}
</style>
