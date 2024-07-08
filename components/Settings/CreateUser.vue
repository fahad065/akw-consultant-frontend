<template>
    <Dialog v-model:visible="openAddUser" @show="modalShow" :draggable="false" modal :showHeader="false"
        class="rounded-2xl" :style="{ width: '35svw' }">
        <form @submit.prevent="addUser" id="user" class="flex flex-col w-full space-y-3.5 my-3.5">
            <div class="flex flex-row items-center justify-between">
                <span class="text-base font-semibold">{{ titleText }}</span>

            </div>

            <div class="relative">
                <Avatar :image="!!localPreview ? localPreview : placeholder" shape="circle" size="xlarge"
                    class="border p-2.5" />
                <input accept=".jpg,.jpeg,.png" type="file" class="hidden" ref="file"
                    @change="image_url = $event.target.files[0]">
                <i @click="file.click()"
                    class="pi pi-pencil text-sm text-white bg-gray-500 p-1.5 rounded-full absolute bottom-0.5 left-11" />
            </div>
            <CustomInputContainer label="First Name" class="containerHolder">
                <InputText id="first_name" v-model="first_name" class="input" />
                <span v-if="errors.first_name" class="text-xs text-red-400">First Name is required</span>
            </CustomInputContainer>

            <CustomInputContainer label="Middle Name" class="containerHolder">
                <InputText id="middle_name" v-model="middle_name" class="input" />
            </CustomInputContainer>

            <CustomInputContainer label="Last Name" class="containerHolder">
                <InputText id="last_name" v-model="last_name" class="input" />
                <span v-if="errors.last_name" class="text-xs text-red-400">Last Name is required</span>
            </CustomInputContainer>
            <CustomInputContainer label="Role" class="containerHolder">
                <Dropdown :options="roles" class="input" :placeholder="user.role ? user.role.name : 'Select role'"
                    v-model="role" optionLabel="name" optionValue="_id" />
                <span v-if="errors.role" class="text-xs text-red-400">Role is required</span>
            </CustomInputContainer>


            <CustomInputContainer v-if="!edit" label="Assign Password" class="containerHolder">
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-lock"></i>
                    </InputGroupAddon>
                    <Password class="w-full" v-model="password" toggleMask :feedback="false" />
                </InputGroup>
                <small class="p-error" v-if="errors.password">Password is required</small>
            </CustomInputContainer>

            <CustomInputContainer label="Email" class="containerHolder">
                <InputText id="email" class="input" v-model="email" />
                <span v-if="errors.email" class="text-xs text-red-400">Email is required</span>
            </CustomInputContainer>

            <div class="flex flex-row items-center justify-end space-x-4">
                    <button type="submit" class="btn-ok px-3 py-2">
                        <i v-if="loading" class="pi pi-spin pi-spinner" style="font-size: 0.8rem"></i>
                        <span v-else> Save</span>

                    </button>
                    <button type="button" @click="openAddUser = false" class="btn-clear !border-red-500 !text-red-500 px-3 py-1.5">Close</button>

                </div>
        </form>
    </Dialog>
</template>


<script setup>
import placeholder from '@/assets/images/placeholder.png'




const file = ref();




const toast = useToast()
const openAddUser = defineModel();
const emit = defineEmits(['update'])
const props = defineProps(['edit', 'user'])






const loading = ref(false)
const roles = ref([])
const titleText = computed(() => props.edit ? 'Edit user' : 'Add new user')



const computedInitialValues = computed(() => {
    if (props.edit) {
        return {
            image_url: props.user?.image_url,
            first_name: props.user?.first_name,
            middle_name: props.user?.middle_name,
            last_name: props.user?.last_name,
            role: props.user?.role._id,
            email: props.user?.email,
            user_status: props.user?.user_status
        }
    }

})



const computedValidationSchema = computed(() => {
    return {
        ...(!props.edit && { password: '' }),
        first_name: '',
        last_name: '',
        dob: '',
        role: '',
        // marital_status: '',
        address: '',
        email: '',
        phone: '',

    }
})

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: computedValidationSchema,
    initialValues: computedInitialValues
});



const [image_url] = defineField('image_url')
const [first_name] = defineField('first_name');
const [role] = defineField('role')
const [middle_name] = defineField('middle_name');
const [last_name] = defineField('last_name');
const [user_status] = defineField('user_status');
const [email] = defineField('email');
const [password] = defineField('password')


const localPreview = computed(() => {
    if (typeof (image_url.value) == 'object') {
        return window.URL.createObjectURL(image_url.value)
    } else {
        return image_url.value
    }
})



const addUser = handleSubmit(async (values) => {
    loading.value = true
    let _image_url;
    let { first_name, middle_name, password, email, last_name, role, image_url, ...obj } = values

    if (typeof (image_url) == 'object') {
        _image_url = await uploadDocumentS3(image_url)
    }

    const body = {
        first_name,
        middle_name,
        image_url: _image_url? _image_url : '',
        last_name,
        role,
        password,
        email,
    }

    if (!!props.edit) {
        useMyFetch(`/users/update-user/${props.user?._id}`, {
            method: "PATCH",
            body,
            onResponse: ({ response }) => {
                if (response.status == 200) {
                   
                    toast.add({
                        severity: 'success',
                        summary: 'User created Successfully',
                        life: 3000
                    });
                    emit('update');
                    openAddUser.value = false;

                }
                loading.value = false
            }
        })

    } else {
        useMyFetch(`/users/add-users`, {
            method: 'POST',
            body,
            onResponse: ({ response }) => {
                if (response.status == 201) {
                    loading.value = false
                    toast.add({
                        severity: 'success',
                        summary: 'User created Successfully',
                        life: 3000
                    });
                    emit('update', response._data.data);

                    openAddUser.value = false;
                }
            }
        });
    }

});


const fetchAllRoles = () => {
    useMyFetch('/roles', {
        method: "GET",
        onResponse: ({ response }) => {
            roles.value = response._data.data;
        }
    })
}


const countries = ref();

const loadCountries = async () => {
    const allCountries = await import('i18n-iso-countries/langs/en.json');
    countries.value = Object.values(allCountries.countries).map((country) => {
        return Array.isArray(country) ? country[0] : country;
    });
};



const modalShow = () => {
    loadCountries();
    fetchAllRoles()
};



</script>


<style scoped>
#user {
    .containerHolder {
        @apply !w-full;
    }

    .input {
        @apply py-1 px-1 !rounded-md !text-xs !w-full h-[40px];
    }
}
</style>