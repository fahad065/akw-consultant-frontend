<script setup>
    import keyhole from '@/assets/svgs/keyhole.svg'
    import Login from '~/components/Login/Login.vue';
    import * as yup from 'yup';



    definePageMeta({
        layout: 'empty',
        auth: {
            unauthenticatedOnly: true,
            navigateAuthenticatedTo: '/dashboard'
        },
        layoutTransition: true
    });




    const formType = ref('login');
    const resetMail = ref();
    const token = ref();

    const updateMail = e => resetMail.value = e;
    const updateToken = e => token.value = e;
    const changeForm = e => formType.value = e;


</script>

<template>
    <div class="login_wrapper">
        <div class="h-screen login_wrapper">
            <div class="flex items-center px-10 2xl:py-16 space-x-4">
                <div class="mt-[0.5rem] 2xl:mt-0">
                </div>
                <DividerVertical />
                <div>
                </div>
            </div>

            <div class="flex items-center justify-center w-full">
                <div class="items-center flex-row flex lg:gap-x-56">
                    <div class="hidden xl:block">
                        <div class="lg:ml-10 xl:mr-0 xl:grid pt-28  h-[700px] place-items-center">
                            <img loading="lazy" decoding="async" src="@/assets/images/Login/Mockup.jpg" quality="1" alt="frontend app preview" class="lg:max-w-[85%] xl:max-w-[75%] mx-auto my-0 hidden lg:block" />
                            <div class="flex flex-col items-center justify-between">
                                <h2 class="hidden text-white lg:block lg:text-2xl font-manrope">Vue3 + Nuxt3.</h2>
                            </div>
                        </div>
                    </div>

                    <div class="lg:mr-32 mt-[3.5rem] 2xl:mt-0">
                        <Card class="w-[315px] md:w-[500px] lg:w-[450px] xl:w-[500px] rounded-lg">
                            <template #header>
                                <div class="relative">
                                    <p class="w-full h-52 md:h-64 bg-gray-700 rounded-t-lg">
                                        <div decoding="async" quality="1" alt="Login" style="display: flex; justify-content: center;" class="absolute -translate-x-1/2 -translate-y-1/2 w-96 top-1/2 left-1/2">
                                            <p style="color:black;font-weight: 700;"><strong>Frontend</strong></p>
                                        </div>
                                    </p>
                                </div>
                            </template>
                            <template #content>
                                <div class="relative">
                                    <div class="md:px-3">
                                        <div class="curve-parent">
                                            <div class="curve relative">
                                                <div class="grid w-16 h-16 bg-[#1A70D4] rounded-full place-items-center !z-50 absolute -top-[3.2rem] -left-[5px]">
                                                    <img loading="lazy" decoding="async" :src="keyhole" class="w-6 h-6 ml-3 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <Login v-if="formType == 'login'" @change-form="changeForm" />
                                    </div>
                                </div>
                            </template>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
        <Toast position="top-right" />
    </div>
</template>

<style scoped>
body {
  overflow: hidden;
}


.p-inputgroup .p-inputtext {
  color: unset;
}

.curve {
  position: absolute;
  top: -8px;
  left: 18px;
  z-index: 1;
}

.curve::before {
  position: absolute;
  top: -66px;
  left: -58px;
  content: '';
  display: block;
  width: 178px;
  height: 63px;
  -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3NiAzMSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT5iZ19zb3VyY2VfYmFkZ2VfMTwvdGl0bGU+PGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+PGcgaWQ9IkxheWVyXzEtMiIgZGF0YS1uYW1lPSJMYXllciAxIj48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik01Ny42NywxMS45NEM1Mi4zNiw2LjcxLDQ4LjQyLDAsMzguMywwSDM3LjdDMjcuNTgsMCwyMy42NCw2LjcxLDE4LjMzLDExLjk0LDE0LjQ3LDE2Ljc2LDYuNjEsMTcuODEsMCwxOFYzMUg3NlYxOEM2OS4zOSwxNy44MSw2MS41MywxNi43Niw1Ny42NywxMS45NFoiLz48L2c+PC9nPjwvc3ZnPg==);
  clip: rect(0px, 142px, 36px, 9px);
  z-index: 0;
  background: #fff;
}
</style>