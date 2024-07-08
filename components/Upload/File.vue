<template>
  <div class="upload_file__custom">
    <FileUpload name="demo[]" @upload="onTemplatedUpload($event)" :multiple="multiple" accept="image/*,.pdf"
      :maxFileSize="1000000" @select="onSelectedFiles">
      <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
        <div class="flex align-items-center justify-content-center flex-column file__text_wrap">
          <i class="pi pi-cloud-upload text-2xl text-400 border-400" />
          <p class="mt-1 mb-0 text-center font-bold line-height-2 pb-0">
            Drag and drop files to here to upload.<br />Or
          </p>
          <div class="flex gap-2 align-items-center file__button_wrap">
            <p class="text-primary font-bold cursor-pointer" @click.prevent="chooseCallback()">
              Browse files
            </p>
            <p class="text-danger font-bold cursor-pointer" @click.prevent="
      clearCallback();
    setStyle([]);
    " v-if="files.length > 0">
              Clear files
            </p>
          </div>
          <ProgressBar :value="totalSizePercent" :showValue="false" v-if="files.length > 0 && showProgress" :class="[
      'md:w-20rem h-10px mt-2 w-full md:ml-auto',
      { 'exceeded-progress-bar': totalSizePercent > 100 },
    ]"><span class="white-space-nowrap">{{ totalSize }}B / 1Mb</span></ProgressBar>
        </div>
      </template>
      <template #content="{
      files,
      chooseCallback,
      uploadedFiles,
      removeUploadedFileCallback,
      removeFileCallback,
    }">
        <div v-if="files.length > 0">
          <div class="flex flex-wrap p-0 sm:p-2 gap-2">
            <div v-for="(file, index) of files" :key="file.name + file.type + file.size"
              class="card p-4 m-0 px-2 flex border-1 surface-border align-items-center gap-3 w-full files__item_wrap">
              <div class="flex gap-2 align-items-center">
                <img loading="lazy" decoding="async" v-if="file.objectURL" role="presentation" :alt="file.name"
                  :src="file.objectURL" width="100" height="50" class="shadow-2" />
                <div>
                  <h4 class="font-semibold">{{ file.name }}</h4>
                  <h6>{{ formatSize(file.size) }}</h6>
                </div>
              </div>

              <Badge value="Pending" severity="warning" v-if="showItemStatus" />
              <i v-ripple class="p-ripple pi pi-times text-danger"
                @click="onRemoveTemplatingFile(file, removeFileCallback, index)"></i>
            </div>
          </div>
        </div>
        <div v-if="uploadedFiles.length > 0">
          <div class="flex flex-wrap p-0 sm:p-5 gap-5">
            <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size"
              class="card p-4 m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
              <div>
                <img loading="lazy" decoding="async" v-if="file.objectURL" role="presentation" :alt="file.name"
                  :src="file.objectURL" width="100" height="50" class="shadow-2" />
              </div>
              <span class="font-semibold">{{ file.name }}</span>
              <div>{{ formatSize(file.size) }}</div>
              <Badge value="Completed" class="mt-3" severity="success" />
              <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined rounded
                severity="danger" />
            </div>
          </div>
        </div>
        <div v-if="current && files.length === 0">
          <div class="flex flex-wrap p-0 sm:p-2 gap-2">
            <div class="flex gap-2 align-items-center">
              <img loading="lazy" decoding="async" role="presentation" :alt="current" :src="current" width="100"
                height="50" class="shadow-2" />

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

<script>
export default {
  name: "FileInputCustom",
  props: {
    modelValue: {
      default() {
        return [];
      },
      required: true,
    },
    accepts: {
      default: "image/*",
    },
    showItemStatus: {
      type: Boolean,
      default: false,
    },
    showProgress: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true
    },
    current: {
      type: String
    }
  },
  data() {
    return {
      totalSize: 0,
      totalSizePercent: 0,
      fileMimeType: true
    };
  },
  watch: {
    files: function (value) {
      this.setStyle(value);
    },
  },
  emits: ["update:modelValue", "uploadFile"],
  computed: {
    files: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  mounted() {
    this.setStyle(this.files);
  },
  methods: {
    onRemoveTemplatingFile(file, removeFileCallback, index) {
      removeFileCallback(index);
      this.totalSize -= parseInt(this.formatSize(file.size));
      this.totalSizePercent = this.totalSize / 10;
      this.setStyle(this.files);
    },
    onClearTemplatingUpload(clear) {
      clear();
      this.totalSize = 0;
      this.totalSizePercent = 0;
    },
    onSelectedFiles(event) {
      this.files = event.files;
      this.files.forEach((file) => {
        this.totalSize += parseInt(this.formatSize(file.size));
      });
    },
    uploadEvent(callback) {
      this.totalSizePercent = this.totalSize / 10;
      callback();
    },
    onTemplatedUpload() {
      this.$toast.add({
        severity: "info",
        summary: "Success",
        detail: "File Uploaded",
        life: 3000,
      });
      this.$emit('uploadFile')
    },
    formatSize(bytes) {
      if (bytes === 0) {
        return "0 B";
      }

      let k = 1000,
        dm = 3,
        sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
    setStyle(value = []) {
      const element = document.querySelector(
        ".upload_file__custom .p-fileupload-content"
      );

      if (element) {
        if (!value.length) {
          element.classList.add("file_absolute");
        } else {
          element.classList.remove("file_absolute");
        }
      }
    },
  },
};
</script>
<style lang="scss">
.file__action_btn {}

.upload_file__custom {
  .p-fileupload-content {
    padding: 0px;
    border: none;
  }

  .p-fileupload .p-fileupload-buttonbar {
    border-radius: 0px;
  }

  .p-fileupload-buttonbar {
    background: #f4f5f6;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    width: 98%;
    margin: auto;
  }

  .p-fileupload {
    border: 2px dashed #e2e5ea;
    background: #f4f5f6;
    border-radius: 10px;
    position: relative;
  }

  .p-fileupload-content.file_absolute {
    position: absolute;
    inset: 0.5%;
    width: 99%;
    border-radius: inherit;
    background: transparent;
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
</style>
