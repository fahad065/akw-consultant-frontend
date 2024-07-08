<template>
<div class="w-full !h-[95svh] mb-0 dashboard-wrapper pr-1 bg-white">
    <div class="">
      <TabView :lazy="true">
        <TabPanel header="Dashboard">
          <UserList />
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup>
import UserList from '~/components/dashboard/userList.vue';

  useHead({
    title: 'Dashboard - Frontend'
  });

definePageMeta({ layout: 'default', layoutTransition: true });

const [read, write] = useNamedPermissions('dashboard');

const resetQueries = () => {
  start.value = '';
  end.value = '';
  consultants.value = []
};
</script>

<style lang="scss">
.dashboard-wrapper .p-tabview-panels {
  padding: 0 !important;
}
</style>
