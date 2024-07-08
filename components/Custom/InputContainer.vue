<template lang="">
  <div class="space-y-2">
    <p class="text-xs text-nowrap md:text-sm font-light mb-1" v-if="label">{{ label }} <sup v-if="required" class="text-red-400 ">*</sup> </p>
    <slot />
  </div>
</template>
<script setup>
const props = defineProps({
  required: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: 'This is label'
  }
});
</script>
<style lang="scss">
.cic__input_wrap {
  p {
    font-size: 0.85rem;
    font-weight: 300;
    padding-bottom: 0.4rem;
  }
}
</style>
