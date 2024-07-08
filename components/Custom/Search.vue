<template>
    <div class="action__btn">
        <Button icon="pi pi-search" class="search_icon_btn !text-xs !md:text-sm" :class="`${activeSearchBar ? 'search_active' : ''}`"
            @click="activeSearchBar = !activeSearchBar" />
        <InputText :class="`${activeSearchBar ? 'active_search' : ''}`" class="search_bar" v-model="search"
            @blur="activeSearchBar = false" :placeholder>
        </InputText>
    </div>
</template>


<script setup>

// const props=defineProps(['placeholder'])
const activeSearchBar=ref(false);
const search = defineModel();
const placeholder=ref('Search')

</script>
