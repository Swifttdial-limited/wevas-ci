<template>
<div>
  <b-nav-item>
    <b-button
      variant="primary"
      v-b-modal.buy-credits-modal
    >
        Buy Credits
        </b-button>
  </b-nav-item>
  <b-modal
      id="buy-credits-modal"
      title="Buy Credits"
      ok-title="Buy"
      cancel-variant="outline-secondary"
      @ok="SubmitForm"
    >
      <b-form>
        <b-form-group
          label="Organisation"
          label-for="organisation"
        >
          <b-form-input
            id="organisation"
            v-model="membership.organisation_name"
            disabled
          />
        </b-form-group>
        <b-form-group
          label="Account Number"
          label-for="account-number"
        >
          <b-form-input
            id="account-number"
            v-model="buyCreditsPayload.account_number"
            disabled
          />
        </b-form-group>
        <b-form-group
          label="Phone Number"
          label-for="phone-number"
        >
          <b-form-input
            id="phone-number"
            v-model="buyCreditsPayload.msisdn"
          />
        </b-form-group>
        <b-form-group
          label="Select Bulk Account"
          label-for="select-account"
        >
          <v-select
            id="select-account"
            v-model="buyCreditsPayload.account_type"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="BulkAccountsOptions"
            label="name"
            :reduce="name => name.value"
            :clearable="false"
            placeholder="Select Account"
          />
        </b-form-group>
        <b-form-group
          label="Amount"
          label-for="amount"
        >
          <b-form-input
            id="amount"
            v-model="buyCreditsPayload.amount"
            type="number"
          />
        </b-form-group>
      </b-form>
    </b-modal>
    <b-modal
      :visible="submitSucceeded"
      id="modal-success"
      ok-only
      ok-title="Close"
      title="CHECK YOUR PHONE, ENTER MPESA PIN To COMPLETE"
      @close="submitSucceeded ===false"
    >
      <b-card-text
      class="text-secondary"
      >
        {{ onSucceedText }}
      </b-card-text>
    </b-modal>
</div>
</template>

<script>
import {
  BNavItem,
  BButton,
  BModal,
  BFormGroup,
  BFormInput,
  BForm,
  BCardText,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { useToast } from 'vue-toastification/composition'
import { ref } from '@vue/composition-api'
import vSelect from 'vue-select'
import axios from '@axios'
import Vue from 'vue'

export default {
  components: {
    BNavItem,
    BButton,
    BModal,
    BFormGroup,
    BFormInput,
    BForm,
    vSelect,
    BCardText,
  },
  setup() {
    const submitSucceeded = ref(false)
    const onSucceedText = ref(null)
    const toast = useToast()
    const bulkAccounts = ref(JSON.parse(JSON.stringify(Vue.$cookies.get('userData').bulk_accounts)))
    const membership = ref(JSON.parse(JSON.stringify(Vue.$cookies.get('userData').membership)))
    const BulkAccountsOptions = [
      { name: 'Promotional', value: 1 },
      { name: 'Transactional', value: 2 },
    ]
    const blankBuyCredits = {
      msisdn: '',
      amount: '',
      org_id: membership.value.organisation_id,
      account_type: 1,
      account_number: bulkAccounts.value.account_number,
    }
    const buyCreditsPayload = ref(JSON.parse(JSON.stringify(blankBuyCredits)))
    const resetPayloadData = () => {
      buyCreditsPayload.value = JSON.parse(JSON.stringify(blankBuyCredits))
    }
    const SubmitForm = () => {
      submitSucceeded.value = false
      const postData = {
        msisdn: buyCreditsPayload.value.msisdn,
        org_id: buyCreditsPayload.value.org_id,
        amount: buyCreditsPayload.value.amount,
        ref_no: `${buyCreditsPayload.value.account_number}#${buyCreditsPayload.value.account_type}`,
      }
      axios.post('/payments/stkpush-dump', postData).then(res => {
        resetPayloadData()
        onSucceedText.value = res.data.description
        submitSucceeded.value = true
        console.log('Succedd', submitSucceeded)
      })
        .catch(() => {
          toast({
            component: ToastificationContent,
            props: {
              title: 'Error Iniating request.Please try again Later',
              icon: 'AlertTriangleIcon',
              variant: 'danger',
            },
          })
        })
    }
    return {
      bulkAccounts,
      membership,
      BulkAccountsOptions,
      buyCreditsPayload,
      SubmitForm,
      resetPayloadData,
      submitSucceeded,
      onSucceedText,
    }
  },
}
</script>
