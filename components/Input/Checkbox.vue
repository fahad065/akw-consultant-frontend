<template>
  <div class="flex items-center justify-start space-x-2">
    <input class="h-fit w-fit" v-model="checked" id="check" type="checkbox" />
    <p class="text-sm">{{ label }}</p>
  </div>
</template>

<script setup>
const checked = defineModel();

const props = defineProps({
  label: {
    type: String,
    default: ''
  }
});
</script>
