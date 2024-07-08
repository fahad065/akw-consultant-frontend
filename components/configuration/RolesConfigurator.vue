<template>
    <div class="mx-2.5 h-[80vh]">
        <Dialog v-model:visible="showModal" modal :header="editMode ? 'Edit Role' : 'Create Role'"
            :style="{ width: '35rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <form @submit.prevent="handleRoleEdit" class="flex flex-col space-y-4 mt-2">
                <CustomInputContainer label="Role Name" class="w-full">
                    <InputText type="text" v-model="_id" class="hidden" />
                    <InputText type="text" v-model="name" :invalid="true" />
                    <small class="p-error" v-if="errors?.name">Role name is required</small>
                </CustomInputContainer>

                <div class="flex flex-row items-center justify-center space-x-6">
                    <button :disabled="isSubmitting" type="submit" class="btn-ok w-4">
                        <i v-if="isSubmitting" class="pi pi-spin pi-spinner" />
                        <span v-else>{{ editMode ? 'Save' : 'Add' }}</span>
                    </button>
                    <button :disabled="isSubmitting" @click="showModal = false" type="button" class="btn-clear w-4">
                        Close
                    </button>
                </div>
            </form>
        </Dialog>

        <div class="flex flex-row items-center justify-between w-full my-3">
            <p class="text-black w-full text-base font-semibold">
                Roles Configurator
            </p>
            <div class="flex flex-row items-center justify-end space-x-2 w-full">
                <Dropdown @change="fetchRole($event.value)" :options="roles" class="w-5 xl:w-3"
                    placeholder="Select role" v-model="selectedRole" optionLabel="name" optionValue="_id" filter />
                <button @click="triggerModal(false)" class="btn-ok !py-2">
                    <i class="pi pi-plus text-sm text-white" />
                    <span class="text-sm">Add Role</span>
                </button>
            </div>
        </div>

        <div v-if="selectedRole" class="flex flex-col space-y-2.5 my-1.5">
            <p class="text-sm">
                <sup>*</sup>Write Permissions include actions such as POST, UPDATE, DELETE
                Actions
            </p>
            <p class="text-sm">
                <sup>*</sup>Read Permissions include actions such as READ Actions
            </p>
        </div>

        <div class="w-full h-[53svh] 2xl:h-[68vh] overflow-y-auto">
            <div v-if="selectedRole" class="flex items-center justify-start space-x-3 my-2">
                <p>
                    <span class="font-semibold">Role Name :</span> {{ currentRole.name }}
                </p>
                <button @click="triggerModal(true)" class="btn-ok !py-2">
                    <i class="pi pi-pencil text-sm" />
                    <span>Edit role name</span>
                </button>
            </div>
            <DataTable v-if="selectedRole" stripedRowsid="name" tableStyle="width: full"
                class="main__table elevation-0 p-datatable-sm" :value="currentRole?.permissions" rowHover
                scroll-height="54svh" highlightOnSelect>
                <Column header="Route">
                    <template #body="slotProps">
                        <p class="text-sm first-letter:uppercase">
                            {{ slotProps.data.name }}
                        </p>
                    </template>
                </Column>

                <Column v-if="selectedRole" header="Read Permission">
                    <template #body="slotProps">
                        <input v-if="typeof slotProps.data.permissions.read != 'undefined'"
                            @change="turnWriteOff($event.target.checked, slotProps.data.name)" type="checkbox"
                            v-model="slotProps.data.permissions.read" />
                    </template>
                </Column>

                <Column v-if="selectedRole" header="Write Permission">
                    <template #body="slotProps">
                        <input v-if="typeof slotProps.data.permissions.write != 'undefined'"
                            @change="turnReadAuto($event.target.checked, slotProps.data.name)" type="checkbox"
                            v-model="slotProps.data.permissions.write" />
                    </template>
                </Column>
            </DataTable>

            <div v-if="selectedRole" class="flex flex-row items-center my-2.5 justify-center">
                <button @click="updateRole(currentRole)" :disabled="isSubmitting" class="btn-ok text-lg w-64 !py-3.5">
                    <i v-if="isSubmitting" class="pi pi-spin pi-spinner" />

                    <span v-else class="text-sm">Update</span>
                </button>
            </div>

            <p v-if="!selectedRole" class="text-sm text-center my-12">
                Select a role to view permissions
            </p>
        </div>
    </div>
</template>

<script setup>
import { items } from '~/composables/routes';

const { getSession } = useAuth();

const toast = useToast();

const roles = ref([]);
const selectedRole = ref();
const showModal = ref(false);
const editMode = ref(false);

const currentRole = ref({});

const {
    defineField,
    resetForm,
    values,
    isSubmitting,
    errors,
    handleSubmit,
    validate
} = useForm({
    validationSchema: {
        name: ''
    }
});

const [_id] = defineField('_id');
const [name] = defineField('name');

const defaultPermissionsObject = ref([]);

const initializePermissions = () => {
    defaultPermissionsObject.value = items.value.map((x, index) => {
        return {
            name: x.key,
            permissions: x.permissions.reduce((x, y) => ({ ...x, [y]: true }), {})
        };
    });

    defaultPermissionsObject.value.push({
        name: 'settings',
        permissions: {
            write: false
        }
    });

    // defaultPermissionsObject.value.push({
    //     name: 'activities',
    //     permissions: {
    //         read: false,
    //         write: false
    //     }
    // });
};

const turnWriteOff = (e, key) => {
    const write = currentRole.value.permissions.find((x) => x.name == key)
        .permissions?.write;
    if (!e && typeof write != 'undefined') {
        currentRole.value.permissions.find(
            (x) => x.name == key
        ).permissions.write = false;
    }
};

const turnReadAuto = (e, key) => {
    const read = currentRole.value.permissions.find((x) => x.name == key)
        .permissions?.read;
    if (e && typeof read != 'undefined') {
        currentRole.value.permissions.find(
            (x) => x.name == key
        ).permissions.read = true;
    }
};

const triggerModal = (v) => {
    editMode.value = v;

    if (v) {
        name.value = currentRole.value.name;
        _id.value = currentRole.value._id;
    }
    showModal.value = true;
};

const fetchAllRoles = () => {
    useMyFetch('/roles', {
        method: 'GET',
        onResponse: ({ response }) => {
            roles.value = response._data.data;
        }
    });
};

const fetchRole = (id) => {
    useMyFetch(`/roles/${id}`, {
        method: 'GET',
        onResponse: ({ response }) => {
            currentRole.value = response._data.data;
        }
    });
};

const updateRole = async (v) => {
    isSubmitting.value = true;
    await useMyFetch(`/roles/${v?._id}`, {
        method: 'PATCH',
        body: v,
        onResponse: ({ response }) => {
            if (response.status == 200) {
                toast.add({
                    severity: 'success',
                    summary: 'Role updated successfully',
                    life: 1500
                });
                isSubmitting.value = false;
                getSession();
            }
        }
    });
};

const handleRoleEdit = handleSubmit(async (values) => {
    if (editMode.value) {
        await updateRole(values);
        currentRole.value.name = values.name;
        showModal.value = false;
        editMode.value = false;
    } else {
        await useMyFetch('/roles', {
            method: 'POST',
            body: {
                name: values.name,
                permissions: defaultPermissionsObject.value
            },
            onResponse: ({ response }) => {
                if (response.status == 201) {
                    toast.add({
                        severity: 'success',
                        summary: 'Role created successfully',
                        life: 1500
                    });
                    roles.value.push(response._data.data);
                    showModal.value = false;
                    editMode.value = false;
                    resetForm();
                }
            }
        });
    }
});

initializePermissions();
fetchAllRoles();
</script>
