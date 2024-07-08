<template lang="">

    <Card class="border-none shadow-none card_container contact__card w-[47%] overflow-x-auto overflow-y-hidden md:w-[232px] lg:w-[235px] 2xl:w-[250px] h-[200px]">
    <template #content>
      <div class="mb-2 cc__avatar_wrap">
        <img loading="lazy" decoding="async" :src="!!image ?image : placeholder" class="h-[65px] w-[65px] rounded-full" crossorigin>
      </div>
      <div>
        <h1 class="text-sm  capitalize">{{ fullName }}</h1>
        <p class="text-xs  my-1.5">{{email}}</p>
        <p class="text-black text-xs ">{{ designation }}</p>
      </div>
    </template>
</Card>

</template>
<script setup>
import placeholder from '@/assets/images/placeholder.png';

const props = defineProps({
  image: {

  },
  first_name: {
    required: true,
    type: String,
    default: 'First name'
  },
  email: {
    required: true,
    type: String
  },
  last_name: {
    required: true,
    type: String,
    default: 'Last name'
  },
  designation: {
    type: String
  },
  status: {}
});






const fullName = computed(() => `${props.first_name} ${props.last_name}`)
</script>
<style scoped>
.title {
  font-family: "Manrope", sans-serif;
  letter-spacing: 0px;
  color: #0a2c4f;
  opacity: 1;
}

.email {
  font: var(--unnamed-font-style-normal) normal medium var(--unnamed-font-size-14) / var(--unnamed-line-spacing-19) var(--unnamed-font-family-manrope);
  letter-spacing: var(--unnamed-character-spacing-0);
  text-align: center;
  letter-spacing: 0px;
  color: #0a2c4f;
  opacity: 1;
}

.phone {
  font: normal normal normal 14px/19px Manrope;
  letter-spacing: 0px;
  color: #8d98a9;
}

.contact__card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 0.2rem;
  background: transparent;
  border: 1px solid #e2e7f1 !important;
}

p {
  font-size: 0.86rem;
}

h1 {
  position: relative;
  bottom: 0.2rem;
  font-size: 0.95rem;
  line-height: 1.1;
  color: #000;
  margin-bottom: 0.2rem;
}

.mobile__text {
  font-size: 0.8rem;
  margin-top: 0.4rem;
}

.cc__avatar_wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.p-avatar {
  width: 5rem;
  height: 5rem;
}

.cc__chip {
  font-size: 9px !important;
  padding: 2px 6px;
  border-radius: 0px;
  background-color: lightgray;
  position: relative;
  bottom: 0.4rem;
  border-radius: 4px;
  font-weight: 400;
}

.cc__chip::first-letter {
  text-transform: capitalize
}
</style>
