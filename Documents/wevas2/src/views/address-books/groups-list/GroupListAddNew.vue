<template>
  <b-sidebar
    id="add-new-group-sidebar"
    :visible="isAddNewGroupSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-group-sidebar-active', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Add New Contact Group
        </h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />

      </div>

      <!-- BODY -->
      <validation-observer
        #default="{ handleSubmit }"
        ref="refFormObserver"
      >
        <!-- Form -->
        <b-form
          class="p-2"
          @submit.prevent="handleSubmit(onSubmit)"
          @reset.prevent="resetForm"
        >

          <!-- Group Name -->
          <validation-provider
            #default="validationContext"
            name="Group Name"
            rules="required"
          >
            <b-form-group
              label="Group Name"
              label-for="group-name"
            >
              <b-form-input
                id="group-name"
                v-model="groupData.name"
                autofocus
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Description -->
          <validation-provider
            #default="validationContext"
            name="Description"
            rules="required"
          >
            <b-form-group
              label="Description"
              label-for="group-description"
            >
              <b-form-textarea
                id="group-description"
                v-model="groupData.description"
                max-rows="2"
                :state="getValidationState(validationContext)"
                :formatter="desFormatter"
                placeholder="Describe what this group contains"
                rows="2"
              />
              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
          <!-- Group Type -->
          <validation-provider
            #default="validationContext"
            name="Group Type"
            rules="required"
          >
            <b-form-group
              label="Group Type"
              label-for="group-type"
              :state="getValidationState(validationContext)"
            >
              <v-select
                v-model="groupData.type"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="typeOptions"
                :reduce="val => val.value"
                :clearable="false"
                input-id="group-type"
                disabled
              />
              <b-form-invalid-feedback :state="getValidationState(validationContext)">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <validation-provider
            #default="validationContext"
            name="Custom Fields"
            rules=""
          >
            <b-form-group
              label="Custom Fields"
              label-for="custom-field"
            >
              <b-form-tags
                v-model="groupData.custom_fields"
                input-id="custom-fields"
                placeholder="Add a custom Field"
                class="mb-2"
                disabled
              />
              <p> Custom Fields: {{ groupData.custom_fields }}</p>
              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
           </validation-provider>
          <div class="d-flex mt-2">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              Add
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="outline-secondary"
              @click="hide"
            >
              Cancel
            </b-button>
          </div>

        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BButton, BFormTextarea, BFormTags,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { ref } from '@vue/composition-api'
import { required, alphaNum, length } from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import store from '@/store'
import Vue from 'vue'
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BFormTextarea,
    BFormTags,
    BButton,
    vSelect,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isAddNewGroupSidebarActive',
    event: 'update:is-add-new-group-sidebar-active',
  },
  props: {
    isAddNewGroupSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      required,
      alphaNum,
      length,
    }
  },
  methods: {
    desFormatter(value) {
      return value.toLowerCase()
    },
  },
  setup(props, { emit }) {
    const membership = JSON.parse(JSON.stringify(Vue.$cookies.get('userData').membership))
    const blankGroupData = {
      name: '',
      description: '',
      email: '',
      type: 1,
      custom_fields: [],
      org_id: membership.organisation_id,
    }

    const typeOptions = [
      { label: 'MSISDN', value: 1 },
      { label: 'EMAIL', value: 2 },
    ]

    const groupData = ref(JSON.parse(JSON.stringify(blankGroupData)))
    const resetgroupData = () => {
      groupData.value = JSON.parse(JSON.stringify(blankGroupData))
    }
    // Use toast
    const toast = useToast()

    const onSubmit = () => {
      store.dispatch('address-books/addGroup', groupData.value)
        .then(() => {
          emit('refetch-data')
          emit('update:is-add-new-group-sidebar-active', false)
          toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Staff Account Created',
              icon: 'CoffeeIcon',
              variant: 'success',
              text: 'Staff account has been created successfully',
            },
          })
        })
    }

    const {
      refFormObserver,
      getValidationState,
      resetForm,
    } = formValidation(resetgroupData)

    return {
      groupData,
      onSubmit,

      refFormObserver,
      getValidationState,
      resetForm,
      typeOptions,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

#add-new-group-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
