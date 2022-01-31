<template>
    <b-card-header class="mb-5">
      <b-card-title>
          <h3
          class="text-success"
          style="text-transform: capitalize;"
          >
          Group
          </h3>
       </b-card-title>
        <b-card-title style="float:right;">
          <b-row cols="12"  offset="2">
            <b-col cols="6">
              <b-form-file
                v-model="file"
                ref="file"
                :state="Boolean(file)"
                placeholder="Upload Contacts"
                accept=".csv, .xlsx"
              >
                <template
                  slot="file-name"
                  slot-scope="{ names }"
                >
                  <b-badge variant="primary">
                    {{ names[0] }}
                  </b-badge>
                  <b-badge
                    v-if="names.length > 1"
                    variant="dark"
                    class="ml-1"
                  >
                    + {{ names.length - 1 }} More files
                  </b-badge>
                </template>
              </b-form-file>
            </b-col>
            <div
            v-if="file!=null"
            class="mr-auto"
            >
              <b-button
              variant="success"
              @click="uploadContacts"
              >
              Upload
              </b-button>
            </div>
            <b-col cols="auto" class="mr-auto">
              <b-button
              variant="gradient-danger"
              @click="$emit('shall-show-email-compose-modal', true); $emit('close-left-sidebar')"
              >
                Send Message
              </b-button>
            </b-col>
            <span>
              <b-dropdown
                v-ripple.400="'rgba(30, 30, 30, 0.15)'"
                text="Actions"
                variant="outline-dark"
                right
              >
              <b-dropdown-item>
                Edit
              </b-dropdown-item>
              <b-dropdown-item>
                Export
              </b-dropdown-item>
              <b-dropdown-item>
                Delete
                </b-dropdown-item>
              <b-dropdown-item>
                Sample CSV
                </b-dropdown-item>
              </b-dropdown>
            </span>
          </b-row>
        </b-card-title>
    </b-card-header>
</template>

<script>
import {
  BCardHeader,
  BCardTitle,
  BButton,
  BDropdown,
  BDropdownItem,
  BFormFile,
  BRow,
  BCol,
  BBadge,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    BCardHeader,
    BCardTitle,
    BButton,
    BDropdown,
    BDropdownItem,
    BFormFile,
    BRow,
    BCol,
    BBadge,
  },
  directives: {
    Ripple,
  },
  props: {
    group: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      groupLocal: JSON.parse(JSON.stringify(this.group)),
      file: null,
    }
  },
  watch: {
    group() {
      this.$nextTick(() => {
        this.updateGroup()
      })
    },
  },
  methods: {
    updateGroup() {
      this.groupLocal = JSON.parse(JSON.stringify(this.group))
      return this.groupLocal
    },
    uploadContacts() {
      const formData = new FormData()
      formData.append('file', this.$refs.file.files[0])
      this.$http.post(`/address-books/${this.groupLocal.id}/add-contacts`, formData)
        .then(res => {
          this.items = JSON.parse(JSON.stringify(res.data.results))
        })
        .catch(res => {
          console.log('ERROR OCCURED', res.data)
        })
    },
  },
}
</script>
