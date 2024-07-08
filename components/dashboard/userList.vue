
<template>
    <div class="flex flex-col space-y-4 bg-white mr-1 h-[93svh]">
        <div class="flex items-center justify-between p-3 border-b">
            <h1 class="font-semibold text-[#4263EB] text-lg">Users</h1>
        </div>
        <div class="h-full px-2">
            <UserTable />
        </div>
    </div>
</template>

<script setup>
import UserTable from './userTable.vue';

</script>