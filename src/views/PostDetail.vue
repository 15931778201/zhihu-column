<template>
  <div class="post-detail-page w-690">
    <article class="mb-5 pb-3" v-if="currentPost">
      <img
        :src="currentPost.image && currentPost.image.url + '?x-oss-process=image/resize,w_850'"
        alt="currentPost.title"
        class="rounded-lg img-fluid my-4"
      />
      <h2 class="mb-4">{{ currentPost.title }}</h2>
      <div
        class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0"
      >
        <div class="col">
          <user-profile
            :user="currentPost.author"
            v-if="typeof currentPost.author === 'object'"
          ></user-profile>
        </div>
        <span class="text-muted col text-right font-italic"
          >发表于：{{ currentPost.createdAt }}</span
        >
      </div>
      <div v-html="currentHTML"></div>
      <div v-if="showEditArea" class="btn-group mt-5">
        <router-link
          type="button"
          class="btn btn-primary"
          :to="{ name: 'create', query: { id: currentPost._id } }"
        >编辑</router-link>
        <button type="button" class="btn btn-danger" @click.prevent="deletePosts">删除</button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { GlabalUserProps, UserProps, ResponseType, PostProps } from '../store'
import UserProfile from '../components/UserProfile.vue'
import MarkdownIt from 'markdown-it'
import modal from '../components/Modal/ModalComp'
import _message from '../components/Message/MessageComp'

export default defineComponent({
  components: {
    UserProfile
  },
  setup () {
    const store = useStore<GlabalUserProps>()
    const route = useRouter()
    const md = new MarkdownIt()
    const postId = route.currentRoute.value.params.id
    onMounted(() => {
      store.dispatch('fetchPostDetail', postId)
    })
    const currentPost = computed(() => store.getters.getPostsDetail(postId))
    const currentHTML = computed(() => {
      const { content, isHTML } = currentPost.value
      if (currentPost.value && content) {
        return isHTML ? content : md.render(content)
      } else {
        return ''
      }
    })
    const showEditArea = computed(() => {
      const { isLogin, _id } = store.state.user
      if (currentPost.value && currentPost.value.author && isLogin) {
        const postAuthor = currentPost.value.author as UserProps
        return _id === postAuthor._id
      } else {
        return null
      }
    })
    const deletePosts = () => {
      modal({
        title: '删除弹窗',
        content: '确认删除吗？',
        confirm: () => {
          store.dispatch('deletePosts', postId).then((res: ResponseType<PostProps>) => {
            _message.success('删除成功，2秒后跳转到文章列表')
            setTimeout(() => {
              route.push({ name: 'column', params: { id: res.data.column } })
            }, 2000)
          })
        }
      })
    }
    return {
      currentPost,
      currentHTML,
      showEditArea,
      deletePosts
    }
  }
})
</script>

<style scoped>
  .w-690 {
    width: 690px;
    margin: 0 auto;
  }
</style>
