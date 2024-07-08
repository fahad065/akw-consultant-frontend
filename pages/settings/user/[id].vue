<template>
  <div class="card h-[91vh] overflow-hidden">
    <div class="flex items-center gap-2 text-[#4263EB] border-b-2 px-4 py-3">
      <i class="pi pi-arrow-left cursor-pointer" @click.prevent="navigateTo('/settings')"></i>
      <p class="font-semibold text-lg">User Details</p>
    </div>

    <div class="flex w-full space-x-2 mt-3 h-[80vh]">
      <!-- left panel -->
      <div class="w-[400px] p-3 bg-white rounded-xl space-y-2 border-t-2 border-b-2 border-r-2">
        <div class="flex items-center gap-2 pb-3">
          <p class="font-medium text-base">User List</p>

          <i class="pi pi-exclamation-circle text-[#888c94] cursor-pointer"></i>
        </div>

        <div class="flex">
          <SearchSimple v-model="search_user" placeholder="Search User" class="z-40" />
        </div>
        <div @scroll="scrollFn" class="flex flex-col h-[65vh] overflow-auto">
          <div class="" v-for="user in users">
            <div @click="switchUser(user._id)" :class="{ 'bg-[#ceeaff]': user._id == currentUser?._id }"
              class="rounded-md cursor-pointer px-3 pt-2">
              <CustomProfile :image="user.profile" :name="user.first_name" :subtitle="user.personal.designation" />
            </div>
          </div>
        </div>
      </div>

      <!-- right panel -->
      <div class="w-full border-t-2 border-b-2 border-l-2 rounded-xl">
        <div class="bg-white w-full rounded-xl py-2 right-panel">
          <TabView>
            <TabPanel header="Details">
              <SettingsUserDetailTab :user="currentUser" @update="refetchUsers" />
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>


const toast = useToast();

const route = useRoute();

const search_user = ref();

const currentUser = ref();

const switchUser = async (id) => {
  const { data, error } = await useMyFetch(`/users/get-user/${id}`);
  await fetchUsers();
  if (!error.value) {
    currentUser.value = data.value.data;
    history.pushState({ user: id }, '', `/users/get-user//${id}`);
    route.params.id = id;
  } else {
    toast.add({ severity: 'error', detail: 'An error occurred', life: 3000 });
  }
};

const users = ref([]);

const fetchUsers = async () => {
  const { data } = await useMyFetch(`/users/all-users`);
  users.value = data.value.data;
};

const fetchUserById = async (id) => {
  const { data } = await useMyFetch(`/users/get-user/${id}`);
  history.pushState({ user: id }, '', `/settings/user/${id}`);
  currentUser.value = data.value.data;
};

const refetchUsers = async () => {
  await fetchUsers();
  await fetchUserById(route.params.id);
};

onMounted(async () => {
  await fetchUsers();
  await fetchUserById(route.params.id);
});
</script>

<style>
.right-panel .p-tabview-nav-container .p-tabview-nav .p-tabview-nav-link {
  background: transparent !important;
  border-color: transparent !important;
}

.right-panel .p-tabview-nav-container .p-tabview-nav .p-tabview-nav-link span {
  font-size: 14px !important;
  font-weight: 500 !important;
}

.right-panel .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  border-bottom: 2px solid #4263EB !important;
}

.right-panel .p-tabview-panels {
  position: relative !important;
  background: transparent !important;
  margin-top: 10px !important;
}

.right-panel .p-tabview-nav li .p-tabview-nav-link:not(.p-disabled):focus {
  box-shadow: none !important;
}

.right-panel .p-tabview-nav li .p-tabview-nav-link:focus {
  color: #4263EB;
}
</style>
