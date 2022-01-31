<template>
  <b-tabs content-class="mt-1">
    <b-tab
    title="Group Info"
    active
    >
        <template #title>
            <feather-icon icon="BookIcon" />
            <span>Group Info</span>
        </template>
    </b-tab>
    <b-tab
    title="Add Contacts"
    >
        <template #title>
            <feather-icon icon="BookIcon" />
            <span>Add Contacts</span>
        </template>
        <group-add-contacts/>
    </b-tab>
    <b-tab
      title="Remove Contacts"
      lazy
    >
        <template #title>
            <feather-icon icon="BookIcon" />
            <span>Remove Contacts</span>
        </template>
    </b-tab>
  </b-tabs>
</template>

<script>
import { BTabs, BTab } from 'bootstrap-vue'
import GroupAddContacts from './GroupAddContacts.vue'

export default {
  components: {
    GroupAddContacts,
    BTabs,
    BTab,
  },
}
</script>
<style lang="scss">
  @import '@core/scss/vue/libs/vue-wizard.scss';
  @import '@core/scss/vue/libs/vue-select.scss';
</style>
