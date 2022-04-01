<template>
  <div
    class="file-upload"
    style="position: relative"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
  >
    <div
      class="file-upload-container d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
      @click.prevent="handleFileUpload"
    >
      <slot v-if="fileStatus === 'loading'" name="uploading">
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only"></span>
          </div>
          <h2>正在上传</h2>
        </div>
      </slot>
      <slot
        v-else-if="fileStatus === 'success'"
        name="uploaded"
        :uploadedData="uploadedData"
      >
        <img :src="uploadedData.url" alt="" />
      </slot>
      <slot v-else name="default">
        <h2>请上传图片，仅支持PNG或者JPG格式</h2>
      </slot>
    </div>
    <input
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange"
    />
    <div class="pointer-style" style="position: absolute" v-show="isVisible">
      <a href="#" title="预览" @click.prevent="previewClick">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          class="bi bi-eye-fill"
          viewBox="0 0 16 16"
        >
          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
          <path
            d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
          />
        </svg>
      </a>
      <a href="#" title="删除" @click.prevent="deleteClick">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          class="bi bi-trash-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"
          />
        </svg>
      </a>
    </div>
    <div class="modal" :class="[previewIsVisible ? 'displayBlock' : 'displayNone']">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">图片预览</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click.prevent="previewModalClose"
            ></button>
          </div>
          <div class="modal-body">
            <img :src="fileUrl" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import axios from 'axios'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error';
type CheckFuntion = (file: File) => boolean;
export default defineComponent({
  props: {
    action: {
      required: true,
      type: String
    },
    beforeUpload: {
      type: Function as PropType<CheckFuntion>
    },
    uploaded: {
      type: Object
    }
  },
  emits: ['file-uploaded', 'file-uploaded-error'],
  setup (props, context) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' : 'ready')
    const fileUrl = ref('')
    const uploadedData = ref(props.uploaded)
    const isVisible = ref(false)
    const previewIsVisible = ref(false)
    watch(() => props.uploaded, (newValue) => {
      if (newValue) {
        fileStatus.value = 'success'
        uploadedData.value = newValue
        fileUrl.value = newValue.url
      }
    })

    const handleFileUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) {
        const files = Array.from(currentTarget.files)
        if (props.beforeUpload) {
          const result = props.beforeUpload(files[0])
          if (!result) {
            return
          }
        }
        fileStatus.value = 'loading'
        const formData = new FormData()
        formData.append('file', files[0])
        axios
          .post(props.action, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(res => {
            fileStatus.value = 'success'
            isVisible.value = true
            fileUrl.value = res.data.data.url
            uploadedData.value = res.data.data
            context.emit('file-uploaded', res.data.data)
          })
          .catch(e => {
            fileStatus.value = 'error'
            context.emit('file-uploaded-error', { e })
          })
          .finally(() => {
            if (fileInput.value) {
              fileInput.value.value = ''
            }
          })
      }
    }
    const handleMouseOver = () => {
      if (!isVisible.value && fileStatus.value === 'success') {
        isVisible.value = true
      }
    }
    const handleMouseLeave = () => {
      if (isVisible.value) {
        isVisible.value = false
      }
    }
    const previewClick = () => {
      previewIsVisible.value = true
    }
    const deleteClick = () => {
      fileUrl.value = ''
      fileStatus.value = 'ready'
      isVisible.value = false
    }
    const previewModalClose = () => {
      previewIsVisible.value = false
    }
    return {
      fileInput,
      fileStatus,
      fileUrl,
      handleFileUpload,
      handleFileChange,
      uploadedData,
      isVisible,
      previewIsVisible,
      handleMouseOver,
      handleMouseLeave,
      previewClick,
      deleteClick,
      previewModalClose
    }
  }
})
</script>

<style scoped>
.pointer-style {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}
.pointer-style svg {
  cursor: pointer;
  margin: 0 4px;
}
.modal-body img {
  width: 100%;
}
.displayNone {
  display: none !important;
}
.displayBlock {
  display: block !important;
}
</style>