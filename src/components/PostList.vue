<template>
  <div class="post-list">
    <article v-for="post in posts" :key="post._id" class="card mb-3 shadow-sm">
      <div class="card-body">
        <h4>
          <router-link :to="`/posts/${post._id}/`">{{
            post.title
          }}</router-link>
        </h4>
        <div class="row my-3 align-items-center">
          <div v-if="post.image" class="col-4">
            <img
              :src="post.image.url + '?x-oss-process=image/resize,m_fill,h_110,w_200'"
              :alt="post.title"
              class="rounded-lg w-100"
            />
          </div>
          <p :class="{ 'col-8': post.image }" class="text-muted">
            {{ post.excerpt }}
          </p>
        </div>
        <span class="text-muted">{{ post.createdAt }}</span>
      </div>
    </article>
    <div class="text-center">
      <button
            class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25"
            v-if="!isLastPage"
            @click="loadMorePage"
          >
            加载更多
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import { GlabalUserProps } from '../store'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import useLoadMore from '../hooks/useLoadMore'
export default defineComponent({
  name: 'PostList',
  setup () {
    const route = useRoute()
    const store = useStore<GlabalUserProps>()
    const total = computed(() => store.state.posts.total)
    const currentPage = computed(() => store.state.posts.currentPage)
    const currentColumnId = route.params.id
    onMounted(() => {
      store.dispatch('fetchPosts', { cid: currentColumnId })
    })
    const list = computed(() => store.getters.getPostsByCid(currentColumnId))
    const { loadMorePage, isLastPage } = useLoadMore('fetchPosts', total, { pageSize: 3, currentPage: currentPage.value ? currentPage.value + 1 : 2 }, currentColumnId)
    return {
      posts: list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>

<style scoped>

.post-list h4 a{
    text-decoration: none;
    color: #1a1a1a;
}
.rounded-lg {
    border-radius: .3rem!important;
}
</style>