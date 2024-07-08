<template>
    <div class="">
        <CreateNewForm v-model="showAddModal" v-if="showAddModal" @update="fetchForms" :edit :user="editableUser" />
        <div class="flex flex-row items-center justify-end space-x-2 w-full">
            <button @click="addFormDialog" class="btn-ok mr-3">
                <i class="pi pi-plus text-white text-xs md:text-sm" />
                <span class="text-white text-xs md:text-sm py-1">Add New</span>
            </button>
        </div>
        <div class="flex flex-col space-y-4 bg-white mr-1 h-[93svh]">
        <div class="flex items-center justify-between p-3 border-b">
            <h1 class="font-semibold text-[#4263EB] text-lg">Forms</h1>
        </div>
        <div class="h-full px-2">
            <div class="">
                <DataTable :value="forms" tableStyle="min-width: 50rem" resizableColumns :rowsPerPageOptions="[5, 10, 15]" :rows="10">
                    <Column header="Name" class="text-xs font-normal" style="width: 14%">
                        <template #body="slotProps">
                            <p class="capitalize">
                                {{ slotProps.data?.form_name}}
                            </p>
                        </template>
                    </Column>
                    <Column header="Upload By" class="text-xs font-normal" style="width: 14%">
                        <template #body="slotProps">
                            <p class="capitalize">
                                {{ slotProps.data?.created_by}}
                            </p>
                        </template>
                    </Column>
                    <Column header="Upload Date" class="text-xs font-normal" style="width: 14%">
                        <template #body="slotProps">
                            <p class="capitalize">
                                {{ slotProps.data?.createdAt?.split('T')[0] ?? '-'}}
                            </p>
                        </template>
                    </Column>
                    <Column header="File" class="text-xs font-normal" style="width: 14%">
                        <template #body="slotProps">
                            <p class="capitalize">
                                <a href="#" @click="previewFile(slotProps.data?.file)">Preview</a>
                            </p>
                        </template>
                    </Column>
                    <Column header="Actions" class="text-xs font-normal" style="width: 1%" v-if="write">
                        <template #body="slotProps">
                            <div class="flex gap-3 items-center" >
                                <i class="pi pi-trash text-[#ff0000] text-md cursor-pointer"
                                    v-tooltip.left="`Delete Details`"
                                    @click.prevent="deleteForm(slotProps.data._id)"></i>
                                    <i class="pi pi-pencil text-[#16171880] text-md cursor-pointer"
                                    v-tooltip.left="`Edit Details`"
                                    @click.prevent="editForm(slotProps.data)"></i>
                            </div>
                            
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
    </div>
   
</template>
<script setup>
    import CreateNewForm from "~/components/Forms/CreateNewForm"
    const forms = ref()
    const showAddModal = ref(false)
    const edit = ref(false)
    const editableUser = ref();

const [read, write] = useNamedPermissions('forms')

    const addFormDialog = e => {
        edit.value = false
        editableUser.value = {}
        showAddModal.value = true
    }

    const config = useRuntimeConfig();

    const previewFile = (fileUrl) => {
        const completeUrl = `${config.public.apiURL}${fileUrl}`
        window.open(completeUrl, '_blank')
    }

    const fetchForms = () => {
        useMyFetch(`/forms/getAll`, {
            methods: 'GET',
            onResponse: ({response}) => {
                forms.value = response._data.data
            }
        })
    }
    const toast = useToast()

    const deleteForm = async (id) => {
        await useMyFetch(`/forms/deleteForm/${id}`, {
            method: 'POST',
            onResponse: async ({ response }) => {
                toast.add({
                    severity: 'success',
                    summary: 'Form Deleted Successfully',
                    life: 3000
                });
                await fetchForms()
            }
        })
    }

    const editForm = (e) => {
        edit.value = true
        editableUser.value = e
        showAddModal.value = true
    }
    
    onMounted(() => {
        fetchForms()
    })
</script>