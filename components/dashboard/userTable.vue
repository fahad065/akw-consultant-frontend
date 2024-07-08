<template>
    <div class="">
        <DataTable :value="customers" :rowHover="true" dataKey="_id" scrollHeight="76svh" :totalRecords
            @page="" resizableColumns :rowsPerPageOptions="[5, 10, 15]" :rows="10"
            :paginate="true" tableStyle="width: full">
            <Column header="Name" class="text-xs font-normal" style="width: 14%">

                <template #body="slotProps">
                    <p class="capitalize">
                        {{ slotProps.data?.first_name}}
                    </p>
                </template>
            </Column>
            <Column header="Name" class="text-xs font-normal" style="width: 14%">

                <template #body="slotProps">
                    <p class="capitalize">
                        {{ slotProps.data?.last_name}}
                    </p>
                </template>
            </Column>
            <Column header="Email" class="text-xs font-normal" style="width: 14%">
                <template #body="slotProps">
                    <p>
                        {{ slotProps.data?.email }}
                    </p>
                </template>
            </Column>
            <Column header="Role" class="text-xs font-normal" style="width: 14%">
                <template #body="slotProps">
                    <p>
                        {{ slotProps.data?.role?.name }}
                    </p>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
<script setup>
    const customers = ref()
    const totalRecords = ref(0);
    const fetchCustomers = () => {
        useMyFetch(`/users/all-users-by-role`, {
            methods: 'GET',
            onResponse: ({ response }) => {
                customers.value = response._data.data;
                totalRecords.value = response._data.total
            }
        })
    };

    onMounted(() => {
        fetchCustomers();
    });
</script>