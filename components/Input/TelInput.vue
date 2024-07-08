<template>
    <vue-tel-input v-bind="$attrs" v-model="value" mode="international" autoFormat validCharactersOnly :maxLen="15"
        :defaultCountry="971" @validate="validatePhone" class="!rounded-md"></vue-tel-input>
    <small class="p-error" v-if="isPhoneInvalid">Enter a valid number</small>
</template>


<script setup>
const value = defineModel()

const isPhoneInvalid = ref()

const validatePhone = (phoneObject => {
    if (phoneObject.number > 4) {
        if (phoneObject.valid) {
            isPhoneInvalid.value = false
        } else {
            isPhoneInvalid.value = true
        }
    }
})

</script>
