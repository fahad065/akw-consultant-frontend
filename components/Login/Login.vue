<template>
    <div class="h-[260px] md:h-[320px]">
        <div class="pb-4">
            <h1 class="text-black">Login</h1>
        </div>

        <form @submit.prevent="handleSignIn" class="grid grid-cols-2 place-items-center gap-y-3">
            <div class="flex flex-col space-y-6 w-full">
                <LazyCustomInputContainer label="Email" class="w-full" required>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-user"></i>
                        </InputGroupAddon>
                        <InputText type="email" v-model="email" />
                    </InputGroup>

                    <small class="p-error" v-if="errors.email">Email is required</small>
                </LazyCustomInputContainer>


                <LazyCustomInputContainer label="Password" class="w-full" required>
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-lock"></i>
                        </InputGroupAddon>
                        <Password class="w-full" v-model="password" toggleMask :feedback="false" />
                    </InputGroup>
                    <small class="p-error" v-if="errors.password">Password is required</small>
                </LazyCustomInputContainer>


            </div>

            <div class="flex items-center justify-end w-full">

            </div>

            <div class="w-full">
                <button :disabled="loading"
                    class="px-4 rounded-md w-full py-2 bg-[#4263EB] hover:bg-[#4263EB] text-white" type="submit">
                    <i v-if="loading" class="pi pi-spin pi-spinner" style="font-size: 0.8rem"></i>
                    <div v-else class="flex">
                        <span class="ml-auto mr-auto basis-3/4" style="width: 316px">Sign In</span>
                    </div>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
    import * as yup from "yup";
    import { useToast } from "primevue/usetoast";

    import outlook from '@/assets/svgs/outlook.svg'

    const { signIn } = useAuth();
    const { getSession } = useAuth()

    const loading = ref(false);
    const toast = useToast();

    const { defineField, handleSubmit, errors, isSubmitting, validate } = useForm({
        validationSchema: yup.object({
            email: yup
                .string()
                .matches(
                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    "enter valid email",
                )
                .required("enter email is required"),
            password: yup
                .string()
                .when(["forget_password"], (forget_password, schema) => {
                    if (forget_password) {
                        return schema.required("enter password is required").min(6);
                    }
                }),
        }),
    });

    const [email] = defineField("email");
    const [password] = defineField("password");

    const handleSignIn = handleSubmit(async (values) => {
        loading.value = true;
        if (Object.keys(values).length > 0 && values) {
            try {

                const res = await signIn({},
                    {
                        ...values,
                        callbackUrl: "/dashboard",
                    },
                );


            } catch (err) {
                const msgLen = document.querySelectorAll('.p-toast-message').length;
                if (msgLen === 0) {
                    toast.add({
                        severity: "error",
                        summary: "User name or password is incorrect!",
                        detail: "",
                        life: 5000,
                    });
                }
            }
            loading.value = false;
        }
    });
</script>

<style scoped>
    .p-inputgroup .p-inputtext {
        color: unset;
    }
</style>
