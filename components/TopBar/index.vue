<template>
    <div class="topbar__container">
        <div class="flex items-center gap-1 ml-auto space-x-1">
            <div class="flex items-center mx-0 md:mx-2 space-x-1 md:space-x-4">
                <Button v-if="settings[1]" @click="goToSettings" class="ml-3">
                    <img loading="lazy" decoding="async" :src="settingsIcon"
                        class="h-[16px] w-[16px] md:h-[20px] md:w-[20px]  text-[#717188]" />
                </Button>
            </div>
            <button type="button"
                class="md:border-1 rounded-[10px] flex items-center gap-3 px-1.5 py-1 md:px-3 md:py-1.5 max-h-[36px]"
                @click="handleRoute">
                <img loading="lazy" decoding="async" :src="profilePic?.length > 1 ? profilePic : placeholder"
                    class="h-[24px] w-[24px] rounded-full" alt="" crossorigin />
                <p class="text-[11px] text-nowrap md:text-sm font-normal text-[#000027] hidden md:block">{{ name ?? '-'
                    }}</p>
            </button>

            <div
                class="h-[22px] w-[26px]  md:w-[35px]  md:h-[35px] mr-4 cursor-pointer ml-2 flex items-center justify-center border border-[#4263eb] rounded-lg">
                <img loading="lazy" decoding="async" src="../../assets/svgs/logout.svg"
                    class="w-[12px] h-[12px] md:w-[20px] md:h-[20px]" alt="" @click="logout" />
            </div>
        </div>
        
        <Toast position="top-right" />
    </div>
</template>

<script setup>
import settingsIcon from '@/assets/svgs/settings.svg'
import placeholder from '@/assets/images/placeholder.png';


const dayjs = useDayjs();

    const route = useRoute();
    const router = useRouter();

const settings = useNamedPermissions('settings')

const handleRoute = () => {
    router.push('/profile');
};

    const auth = useAuth();


const name = computed(() => {
    const user = auth.data?.value?.user;
    return `${user?.first_name ? user?.first_name : ''} ${user?.last_name ? user?.last_name : ''}`;
});

const profilePic = computed(() => {
    return auth.data.value?.user?.image_url;
});

const logout = async () => {
    await auth.signOut({ callbackUrl: '/auth/login', redirect: true });
};

const goToSettings = async () => await navigateTo('/settings');
const op = ref();

const toggle = (event) => {
    op.value.toggle(event);
};



onMounted(async () => {

})
</script>

<style scoped>
.topbar__container {
    min-height: inherit;
    position: sticky;
    top: 0px;
    max-height: 55px !important;
    background: #fff;
    min-width: 100vw;
    display: flex;
    align-items: center;
}

.active {
    background: #fff;
    border-color: #4263eb;
    color: #4263eb;
    font-weight: 700;
    border-width: 0 0 2px 0;
    margin: 0 0 -2px 0;
}
</style>
