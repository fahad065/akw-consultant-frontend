<template>
  <div id="activity">
    <Dialog v-model:visible="openAddActivity" @show="openModal" :closable="false" :draggable="false" modal
      @after-hide="handleBackToAddActivity" :style="{ width: '97rem' }">
      <template #header>
        <div class="flex w-full flex-row py-2.5 border-b border-b-gray-300 items-center justify-between">
          <p class="text-base">Schedule Activity</p>

          <div class="flex flex-row items-center justify-end space-x-4">
            <button @click="handleClose"
              class="bg-white text-red-500 hover:text-white hover:bg-red-600 transition-all duration-200 ease-in border rounded-md text-sm  border-red-500 px-3 py-1.5">
              Discard
            </button>
            <button
              class="text-white border border-[#4263EB] transition-all duration-200 ease-in bg-[#4263EB] hover:bg-blue-600 text-sm rounded-md px-3 py-1.5">
              Save
            </button>
          </div>
        </div>
      </template>
      <div>
        <div class="flex flex-row w-[90vw] h-[100vh] space-x-3">
          <div class="w-[65%] bg-white rounded-xl p-2 flex flex-col">
            <div class="w-full">
              <div class="flex flex-row border-b border-b-gray-300 py-2.5  items-center justify-start space-x-4">
                <Button @click="selectedButton = o.value" v-for="(o, index) in activityOptions" :key="index"
                  class="flex items-center px-4 py-2 space-x-3 border "
                  :class="{ '!bg-[#4263EB] !border-[#4263EB] text-white': selectedButton == o?.value, 'text-[#4263EB] border-gray-200 bg-white': selectedButton != o?.value }">
                  <i :class="[o.icon]" />
                  <span class="text-sm">{{ o.label }}</span>
                </Button>
              </div>


              <div class="flex flex-col">
                <PhoneStage v-if="selectedButton == 'phone'" />
                <VirtualMeeting v-if="selectedButton == 'vmeeting'" />
                <PhysicalMeeting v-if="selectedButton == 'pmeeting'" />
                <EmailStage v-if="selectedButton == 'email'" />
              </div>

            </div>



          </div>

          <div class="w-[30%] h-full bg-white rounded-xl px-1.5">
            <FullCalendar ref="calendar" class="h-[100vh]" :options="calendarOptions" />
          </div>

        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import EmailStage from '../../components/activities/options/EmailStage.vue';
import PhysicalMeeting from "../../components/activities/options/PhysicalMeeting.vue";
import PhoneStage from "~/components/activities/options/PhoneStage.vue";
import VirtualMeeting from "~/components/activities/options/VirtualMeeting.vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

const activityOptions = readonly([
  {
    icon: "pi pi-phone text-sm ",
    label: "Phone Call",
    value: 'phone'
  },
  {
    icon: "pi pi-clock text-sm",
    label: "Virtual Meeting",
    value: 'vmeeting'
  }, {
    icon: "pi pi-user-plus text-sm",
    label: "Physical Meeting",
    value: 'pmeeting'
  }, {
    icon: "pi pi-envelope",
    label: "Email",
    value: 'email'
  }
])


const calendar = ref();

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close')
}

const calendarOptions = reactive({
  plugins: [timeGridPlugin],
  dayMaxEventRows: true,
  nextDayThreshold: '09:00:00',
  headerToolbar: {
    left: "prev,next",
    center: 'title',
    right: ""
  },
  titleFormat: { year: 'numeric', month: 'long' },
  initialView: "timeGridOneDay",
  views: {
    timeGridOneDay: {
      type: "timeGrid",
      duration: { days: 1 },
      buttonText: "Week",
    },
  },
  events: [],
  // eventClick: async (info) => {
  //     info.jsEvent.preventDefault();
  //     const e = events.value.find((x) => x._id == info.event._def.publicId);
  //     await fetchEventById(e._id);
  //     showSidebar.value = true;
  // },
});


const selectedButton = ref('phone')

// import CreateLeadForm from '@/components/opportunities/CreateLeadForm';

const toast = useToast();

const openAddActivity = defineModel();
// TODO- add description input
const activityData = ref({
  lead_id: '',
  assigned_to: '',
  status: '',
  enquiry_date: '',
  enquiry_source: '',
  type: '',
  description: ''
});
const isUserAddingNewLead = ref(false);
const selectedAssignee = computed(() => (activityData.value.assigned_to = ''));

const typeOfActivity = ref([
  { name: 'Phone Call' },
  { name: 'Email' },
  { name: 'Physical/Virtual Meeting' },
  { name: 'Others' }
]);


const sources = readonly([
  'Google Search',
  'Facebook',
  'Referral',
  "LinkedIn",
  'Other'
])

const statuses = ref();

const fetchStatus = async () => {
  const { data } = await useMyFetch(`lead-stages/get-all?module=leads`);
  statuses.value = data.value.data.stages;
};

const leads = ref();
const assignees = ref([]);

const fetchLeads = async () => {
  const { data } = await useMyFetch(`/leads`);
  leads.value = data?.value?.data;
};

const fetchAssignees = async () => {
  const { data, status } = await useMyFetch(`/users/users-drop-down`);
  assignees.value = data.value.data;
};

const handleBackToAddActivity = async () => {
  isUserAddingNewLead.value = false;
  activityData.value = {
    lead_id: '',
    assigned_to: '',
    status: '',
    date: '',
    type: ''
  };
  activityData.value.lead_id = leads.value[leads.value.length - 1]?._id;
};


const addNewLead = e => {
  leads.value.push(e);
}

const addActivity = async () => {
  const payload = {
    ...activityData.value,
    status: activityData.value.status.name
  };

  useMyFetch('/tasks/add', {
    method: 'POST',
    body: payload,
    onResponse: ({ response }) => {
      if (response.ok === true) {
        toast.add({
          severity: 'success',
          summary: 'Task added successfully.',
          detail: '',
          life: 3000
        });

        activityData.value = {
          lead_id: '',
          assigned_to: '',
          status: '',
          date: '',
          type: ''
        };

        openAddActivity.value = false;
      } else {
        toast.add({
          severity: 'error',
          summary: 'An error occurred while adding activity.',
          detail: '',
          life: 3000
        });
      }
    }
  });
};

// // opportunity
const openModal = () => {
  fetchLeads();
  fetchAssignees();
  fetchStatus();
};
</script>
<style style="scss">
#activity {

  .fc .fc-daygrid-day-number {
    @apply text-sm;
  }


  .iconSwitch {
    @apply border border-[#4263EB] text-sm text-[#4263EB] px-2.5 py-1.5 text-xl rounded-xl;
  }

  .fc.fc-theme-standard .fc-toolbar .fc-button {
    @apply !bg-[white] !text-[#8d98a9] text-sm !pb-2 first-letter:uppercase mx-2;
  }

  .fc .fc-button-primary:not(:disabled).fc-button-active:focus,
  .fc .fc-button-primary:not(:disabled):active:focus {
    @apply !shadow-none;
  }

  .fc.fc-theme-standard .fc-toolbar .fc-button[aria-pressed="true"] {
    @apply !text-[#4263EB] !bg-[white] text-sm !border !border-white !border-b-[4px] !border-b-[#4263EB];
  }

  .fc.fc-theme-standard .fc-toolbar .fc-button[aria-pressed="false"] {
    @apply !bg-[white] !border-none text-sm;
  }

  .fc .fc-daygrid-day-top {
    @apply flex flex-row ml-0.5 text-sm;
  }

  .fc-event-time {
    @apply hidden;
  }

  .fc-event-title .fc-sticky {
    @apply ml-2;
  }

  .p-sidebar {
    @apply w-[720px];
  }


  .title {
    @apply text-black font-extrabold uppercase;
  }


  .fc-toolbar-chunk {
    @apply flex flex-row
  }


  .fc .fc-toolbar-title {
    @apply text-base text-sm;
  }


  .fc-direction-ltr .fc-daygrid-event.fc-event-start,
  .fc-direction-rtl .fc-daygrid-event.fc-event-end {
    border-right: none;
    border-bottom: none;
    border-top: none;
    height: 40px;
    align-items: center;
    display: flex;
    padding-left: 2px;
    border-width: 5px;
  }




  .fc-timegrid-slot-label-cushion .fc-scrollgrid-shrink-cushion {
    @apply text-sm;
  }
}
</style>