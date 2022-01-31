<template>
<b-row class="d-flex align-items-right">
        <!-- Per Page -->
        <b-col
          lg="3"
          md="3"
        >
    <el-upload
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove">
    <el-button size="small" type="primary">Click to upload</el-button>
    </el-upload>
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
    <b-col
          lg="3"
          md="3">
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
</template>

<script>
import {
  BButton,
  BDropdown,
  BDropdownItem,
  BRow,
  BCol,
//   BBadge,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    BButton,
    BDropdown,
    BDropdownItem,
    BCol,
    BRow,
    // BBadge,
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
  },
}
</script>
<style lang="css">
@import url("//unpkg.com/element-ui@2.15.5/lib/theme-chalk/index.css");
</style>
