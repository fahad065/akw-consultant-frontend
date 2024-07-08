<template>
    <div class="bg-white p-2 h-[93svh]">
        <TabView :lazy="true">
            <TabPanel header="User Settings">
                <SettingsUserSettings />
            </TabPanel>
            <TabPanel header="Roles Settings">
                <ConfigurationRolesConfigurator />
            </TabPanel>
        </TabView>
    </div>
</template>

<script setup>

definePageMeta({ layout: 'default', layoutTransition: true });

useHead({
  title: 'Settings - Frontend'
});
</script>

<style lang="scss">
// .settings-wrapper {
//   .p-tabview-nav-container .p-tabview-nav {
//     background: transparent;
//     border-color: transparent;
//   }

//   .p-tabview-nav-container .p-tabview-nav .p-tabview-nav-link {
//     background: transparent !important;
//     font-weight: 500;
//     margin-left: 10px;
//   }

//   .p-tabview-nav-container .p-tabview-nav .p-tabview-nav-link span {
//     letter-spacing: 0.01rem !important;
//   }

//   .p-tabview-nav li.p-highlight .p-tabview-nav-link {
//     border-bottom: 2px solid #4263EB;
//     padding-bottom: 5px !important;
//     color:#4263EB;
//   }

//   .p-tabview-panels {
//     position: relative;
//     background: transparent;
//     padding: 0px;
//   }

//   .p-tabview-nav li .p-tabview-nav-link:not(.p-disabled):focus {
//     box-shadow: none;
//     padding-bottom: 5px !important;
//   }

//   .p-tabview-nav li .p-tabview-nav-link {
//     padding-bottom: 5px !important;
//   }
// }</style>
