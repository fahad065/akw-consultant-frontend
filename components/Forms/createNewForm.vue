<template>
    <Dialog v-model:visible="showAddModal" :draggable="false" modal :showHeader="false" class="rounded-2xl" :style="{ width: '35svw' }">
        <form @submit.prevent="addForm" id="form" class="flex flex-col w-full space-y-3.5 my-3.5">
            <div class="flex flex-row items-center justify-between">
                <span class="text-base font-semibold">{{ titleText }}</span>
            </div>
            <div class="relative">
                <CustomInputContainer label="Form Name" class="containerHolder">
                    <InputText id="form_name" v-model="form_name" class="input" />
                </CustomInputContainer>
                <label for="" class="text-md mb-1 font-semibold">Upload Documents</label>
                <UploadFile v-model="file" :multiple="false" />
            </div>
            <div class="flex flex-row items-center justify-end space-x-4">
                <button type="submit" class="btn-ok px-3 py-2">
                    <i v-if="loading" class="pi pi-spin pi-spinner" style="font-size: 0.8rem"></i>
                    <span v-else> Save</span>

                </button>
                <button type="button" @click="showAddModal = false" class="btn-clear !border-red-500 !text-red-500 px-3 py-1.5">Close</button>

            </div>
        </form>
    </Dialog>
</template>
<script setup>
const showAddModal = defineModel();
const titleText = computed(() => props.edit ? 'Edit Form' : 'Add new Form')
const toast = useToast()
const emit = defineEmits(['update'])
const props = defineProps(['edit', 'user'])
const loading = ref(false)
const file = ref()
const computedInitialValues = computed(() => {
    if(props.edit){
        return {
            form_name: props.user?.form_name,
            // file: props.user?.file
        }
    }
})

const computedValidationSchema = computed(() => {
    return {
        ...(!props.edit),
        form_name: '',
        // file: ''
    }
})

const { defineField, handleSubmit } = useForm({
    validationSchema: computedValidationSchema,
    initialValues: computedInitialValues
});

const [form_name] = defineField('form_name')

const addForm = handleSubmit(async (values) => {
    loading.value = true

    const formData = new FormData()
    formData.append('file', file.value[0])
    formData.append('form_name', form_name.value)
    if(!!props.edit){
        useMyFetch(`/forms/update-form/${props.user?._id}`, {
            method: "PATCH",
            body: formData,
            onResponse: ({response}) => {
                if (response.status == 200) {
                   
                   toast.add({
                       severity: 'success',
                       summary: 'Form Updated Successfully',
                       life: 3000
                   });
                   emit('update');
                   showAddModal.value = false;

               }
               loading.value = false
            }
        })
    }else{
        const formData = new FormData()
        formData.append('file', file.value[0])
        formData.append('form_name', form_name.value)
        
        useMyFetch(`/forms/add-form`, {
            method: 'POST',
            body: formData,
            onResponse: ({ response }) => {
                if(response.status == 200){
                    toast.add({
                        severity: 'success',
                        summary: 'Form created Successfully',
                        life: 3000
                    });
                    emit('update', response._data.data);
                    showAddModal.value = false;
                }else{
                    toast.add({
                        severity: 'error',
                        summary: 'Error while submitting',
                        life: 3000
                    });
                }

            }
        })
    }
})

</script>