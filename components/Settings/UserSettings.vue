<template>
  <div class="">
    <CreateUser v-model="openAddUser" v-if="openAddUser" @update="update" :edit :user="editableUser" />
    <div class="flex flex-row items-center justify-end space-x-2 w-full">
      <Search v-model="query.search" placeholder="Search By User Name" />
      <button @click="addUserDialog" class="btn-ok mr-3">
        <i class="pi pi-plus text-white text-xs md:text-sm" />
        <span class="text-white text-xs md:text-sm py-1">Add New</span>
      </button>
    </div>
    <div @scroll="scrollFn" class="h-[75vh] md:h-[78vh] 2xl:h-[82vh] overflow-auto">
      <div class="flex flex-row flex-wrap ">
        <SettingsUserCard @click="viewUserInfo(item)" v-for="(item, index) in users" :image="item?.image_url"
          :email="item?.email" :key="index" :first_name="item.first_name" :last_name="item.last_name"
          :designation="item.role?.name" class="cursor-pointer m-1 md:m-2" />
      </div>
    </div>
  </div>
</template>

<script setup>
import CreateUser from './CreateUser.vue';
import Search from '@/components/Custom/Search.vue'


//  @click.prevent="goToUserDetails(item._id)"

const edit = ref(false)
const editableUser = ref();

const users = ref([])
const query = reactive({
  search: '',
  skip: 0,
  limit: 18
})

const viewUserInfo = (e) => {
  edit.value = true;
  editableUser.value = e;
  openAddUser.value = true

}


const addUserDialog = e => {
  edit.value = false;
  editableUser.value = {};
  openAddUser.value = true
}

const update = () => {
  fetchUsers();

  // const index = users.value.findIndex(x => x._id == e?._id);

  // if (index == -1) {
  //   users.value.push(e);
  // } else {
  //   users.value[index] = e;
  // }

}

const scrollFn = async (el) => {
  if (el.srcElement.offsetHeight + el.srcElement.scrollTop + 1 >= el.srcElement.scrollHeight) {
    query['skip'] = users.value.length;
    paginate.value = true;
  }
};


const paginate = ref(false);


const fetchUsers = () => {
  useMyFetch(`/users/all-users`, {
    query,
    onResponse: ({ response }) => {
      if (paginate.value) {
        users.value = [...users.value, ...response._data.data]
      } else {
        users.value = response._data.data;
      }
    }
  });
};


const openAddUser = ref(false);


onMounted(() => {
  fetchUsers();
});

</script>

<style>
/* .users-wrapper .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  border-bottom: 2px solid #253163;
}

.users-wrapper .p-tabview-nav-container .p-tabview-nav {
  background: transparent;
  border-color: transparent;
}

.users-wrapper .p-tabview-nav-container .p-tabview-nav .p-tabview-nav-link {
  background: transparent !important;
  border-color: transparent;
}

.users-wrapper .p-tabview-nav-container .p-tabview-nav .p-tabview-nav-link span {
  color: #000;
  @apply text-lg font-medium pb-2;
}

.users-wrapper .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  border-bottom: 2px solid #000 !important;
}

.users-wrapper .p-tabview-panels {
  position: relative;
  background: transparent;
  margin-top: 10px !important;
}

.users-wrapper .p-tabview-nav li .p-tabview-nav-link:not(.p-disabled):focus {
  box-shadow: none;
  color: #253163;
}

.customers-scrop-wrap {
  padding-right: 14px;
  height: 72vh !important;
  width: 100%;
  overflow: auto !important;
} */
</style>
