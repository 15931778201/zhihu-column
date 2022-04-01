<template>
  <div class="create-post-page container">
     <upload
      action="/upload"
      :uploaded="uploadedData"
      :beforeUpload='uploadCheck'
      @file-uploaded="fileUploaded"
      >
        <template #uploaded="uploadedData">
          <img :src="uploadedData.uploadedData.url" alt="">
        </template>
      </upload>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">文章标题</label>
        <validate-input
          :rules="titleRule"
          v-model="title"
          placeholder="请输入文章标题"
          type="text"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">文章内容</label>
        <validate-input
          rows="10"
          :rules="contentRule"
          v-model="content"
          placeholder="请输入文章内容"
          tag="textarea"
        ></validate-input>
      </div>
      <template #submit>
        <button class="btn btn-primary" v-if="isEditMode">更新文章</button>
        <button class="btn btn-primary" v-else>创建文章</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlabalUserProps, PostProps, ImageProps, ResponseType } from '../store'
import _message from '../components/Message/MessageComp'
import { beforeUploadCheck } from '../hooks/helper'

export default defineComponent({
  name: 'CreatePosts',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup () {
    const uploadedData = ref()
    const title = ref('')
    const content = ref('')
    const router = useRouter()
    const route = useRoute()
    const imgData = ref<ImageProps>()
    const store = useStore<GlabalUserProps>()
    const isEditMode = !!route.query.id
    const titleRule: RulesProp = [
      { type: 'required', message: '请输入标题' }
    ]
    const contentRule: RulesProp = [
      { type: 'required', message: '请输入内容' }
    ]
    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPostDetail', route.query.id).then((rowData: ResponseType<PostProps>) => {
          const currentPost = rowData.data
          if (currentPost.image) {
            uploadedData.value = currentPost.image
          }
          title.value = currentPost.title
          content.value = currentPost.content || ''
        })
      }
    })
    const fileUploaded = (result: ImageProps) => {
      imgData.value = result
    }
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
      const { error, passed } = result
      if (error === 'format') {
        _message.error('上传图片只能是PNG或者JPG格式')
      }
      if (error === 'size') {
        _message.error('上传图片不能超过1M')
      }
      return passed
    }
    const onFormSubmit = (params: boolean) => {
      if (params) {
        const { column, _id } = store.state.user
        if (column) {
          const post: PostProps = {
            title: title.value,
            content: content.value,
            column: column + '',
            author: _id,
            image: imgData.value
          }
          const actionName = isEditMode ? 'updatePosts' : 'createPosts'
          const sendData = isEditMode ? {
            id: route.query.id,
            payload: post
          } : post
          store.dispatch(actionName, sendData).then(() => {
            _message.success('文章发表成功，即将跳入专栏页面')
            router.push({ name: 'column', params: { id: column } })
          })
        }
      }
    }
    return {
      title,
      titleRule,
      content,
      contentRule,
      onFormSubmit,
      fileUploaded,
      uploadCheck,
      uploadedData,
      isEditMode
    }
  }
})
</script>
<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploaded-area {
  position: relative;
}
</style>