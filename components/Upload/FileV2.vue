<template>
  <div class="upload_file__custom2">
    <!-- add inherent attributes -->
    <FileUpload v-bind="$attrs" v-model="value" @upload="onTemplatedUpload($event)" @select="onSelectedFiles">
      <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
        <Button :id="_id_chooseCallback_btn" class="upload_btn chooseCallback_btn" label="upload"
          @click="() => chooseCallback()" />
        <Button :id="_id_clearCallback_btn" class="upload_btn clearCallback_btn" label="clear"
          @click="() => clearCallback()" />

      </template>
      <template #content="{
      files,
      chooseCallback,
      uploadedFiles,
      removeUploadedFileCallback,
      removeFileCallback,
    }">
        <div class="wrapper-column w-full for-error" style="border: 2px dashed #e2e5ea; border-radius: 10px">
          <div class="wrapper-column" style="
              padding: 1.25rem;
              background: #f4f5f6;
              border-radius: 8px;
              border-bottom-left-radius: 0;
              border-bottom-right-radius: 0;
            ">
            <div class="flex align-items-center justify-content-center flex-column file__text_wrap">
              <i class="pi pi-cloud-upload text-2xl text-400 border-400" />
              <p class="mt-1 mb-0 text-center font-bold line-height-2 pb-0">
                Drag and drop files to here to upload.<br />Or
              </p>
              <div class="flex gap-2 align-items-center file__button_wrap">
                <p class="text-primary font-bold cursor-pointer chooseCallback_btn"
                  @click.prevent="chooseCallback_fn()">
                  Browse files
                </p>
                <p class="text-danger font-bold cursor-pointer clearCallback_btn" @click.prevent="() => {
        clearCallback_fn()
      }
      " v-if="files.length > 0 || $props.image_list.length > 0">
                  Clear files
                </p>
              </div>
            </div>
          </div>

          <div v-if="files.length > 0 || $props.image_list.length > 0">
            <div class="flex flex-wrap p-0 sm:p-2 gap-2">


              <div v-if="$props.image_list.length > 0" v-for="(image, index) of $props.image_list" :key="index"
                class="card p-4 m-0 px-2 flex border-1 surface-border align-items-center gap-3 w-full files__item_wrap">
                <div class="flex gap-2 align-items-center">
                  <Image role="presentation" :src="image.link" width="75"
                    class="shadow-2 border-2 border-transparent border-round flex align-items-center justify-content-center p-1 mr-2"
                    preview />
                  <div>
                    <h4 class="font-semibold">{{ image.name }}</h4>
                  </div>
                </div>

                <i v-ripple class="p-ripple pi pi-times text-danger" @click="
      clear_image_item(index)
      "></i>
              </div>
              <div v-if="files.length > 0" v-for="(file, index) of files" :key="file.name + file.type + file.size"
                class="card p-4 m-0 px-2 flex border-1 surface-border align-items-center gap-3 w-full files__item_wrap">
                <div class="flex gap-2 align-items-center">
                  <Image role="presentation" :alt="file.name" :src="file.objectURL" width="75"
                    class="shadow-2 border-2 border-transparent border-round flex align-items-center justify-content-center p-1 mr-2"
                    preview />
                  <div>
                    <h4 class="font-semibold">{{ file.name }}</h4>
                    <h6>{{ formatSize(file.size) }}</h6>
                  </div>
                </div>

                <i v-ripple class="p-ripple pi pi-times text-danger" @click="
      onRemoveTemplatingFile(file, removeFileCallback, index)
      "></i>
              </div>
            </div>
          </div>
          <div v-if="uploadedFiles.length > 0">
            <div class="flex flex-wrap p-0 sm:p-5 gap-5">
              <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size"
                class="card p-4 m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                <div>
                  <img loading="lazy" decoding="async" role="presentation" :alt="file.name" :src="file.objectURL"
                    width="100" height="50" class="shadow-2" />
                </div>
                <span class="font-semibold">{{ file.name }}</span>
                <div>{{ formatSize(file.size) }}</div>
                <Badge value="Completed" class="mt-3" severity="success" />
                <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined rounded
                  severity="danger" />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #empty>
        <div></div>
      </template>
    </FileUpload>
  </div>
</template>

<script setup>
// Importing necessary functions from Vue
import { ref, watch, onMounted, computed } from "vue"

// Defining properties for the component
const props = defineProps({
  modelValue: {
    default: [] // Default value for modelValue is an empty array
  },
  image_list: {
    type: Array,
    default: [] // Default value for image_list is an empty array
  }
})


function generateRandomId() {
  return Math.floor(Math.random() * Date.now()).toString(16);
}

const _id_chooseCallback_btn = '_' + generateRandomId();
const _id_clearCallback_btn = '_' + generateRandomId();


// Defining the events that this component emits
const emit = defineEmits(["update:modelValue", "update:image_list", "uploadFile"])

// Creating a computed property for modelValue
const value = computed({
  get() {
    return props.modelValue // Getter for modelValue
  },
  set(val) {
    emit("update:modelValue", val) // Setter for modelValue
  },
})

// Function to pause execution for a given time
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// On component mount, log the props after a delay
onMounted(async () => {
  await sleep(1000)

})

// Watch for changes in image_list prop
watch(props.image_list, (NaeVal) => {
  // emit("update:image_list", NaeVal)
});

// Function to trigger file selection
async function chooseCallback_fn() {
  return document.querySelector(`#${_id_chooseCallback_btn}`).click()
}

// Function to clear the image list
async function clearCallback_fn() {
  emit("update:image_list", []);
  return document.querySelector(`#${_id_clearCallback_btn}`).click()
}

// Function to remove an image from the list
const clear_image_item = (index) => {
  let image_list = props.image_list;
  image_list.splice(index, 1);

  emit("update:image_list", image_list);

}

// Function to handle file selection
const onSelectedFiles = (event) => {
  value.value = event.files
}

// Function to remove a file from the list
function onRemoveTemplatingFile(file, removeFileCallback, index) {
  removeFileCallback(index)
}

// Function to handle file upload
function onTemplatedUpload() {

  emit('uploadFile')
}

// Function to format file size
const formatSize = (bytes) => {
  if (bytes === 0) {
    return "0 B"
  }

  let k = 1000,
    dm = 3,
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}


</script>



<style lang="scss">
.upload_file__custom2 {
  .p-fileupload-content {
    padding: 0px;
    border: none;
  }

  .p-fileupload .p-fileupload-content {
    border-radius: 0px;
  }

  .p-fileupload-content {
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    width: 100%;
  }

  .p-fileupload {
    position: relative;
  }

  .file__button_wrap {
    position: relative;
    z-index: 1;
  }

  .files__item_wrap {
    justify-content: space-between;
    padding-right: 1rem !important;

    i {
      cursor: pointer;
    }
  }
}

.upload_file__custom2.p-invalid .p-fileupload {
  border: 2px dashed #f3654a !important;
  border-radius: 10px;
}

.upload_file__custom2 .p-message {
  display: none;
  z-index: -1;
  background-color: aquamarine;
  margin: 0;
  height: 100%;
}

.upload_file__custom2 {
  .p-fileupload .p-fileupload-buttonbar {
    display: none;
  }

  .p-image img {
    aspect-ratio: 1/1;
    height: min-content;
    border-radius: inherit;
    object-fit: cover;
  }

  .p-image .p-image-preview-indicator {
    height: 93%;
    width: 92.5%;
    border-radius: inherit;
    top: 4px;
    left: 1.68px;
    border-color: transparent;
    transform: translate(1.3px, -1px);
  }
}
</style>
