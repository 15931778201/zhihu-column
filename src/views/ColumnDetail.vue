<template>
  <div class="column-detail-page w-690">
    <div
      class="column-info row mb-4 border-bottom pb-4 align-items-center"
      v-if="column"
    >
      <div class="col-3 text-center">
        <img
          :src="column.avatar.url + '?x-oss-process=image/resize,m_pad,h_100,w_100'"
          :alt="column.title"
          class="rounded-circle border w-50"
        />
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <post-list></post-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PostList from '../components/PostList.vue'
import { useStore } from 'vuex'
import { GlabalUserProps } from '../store'
export default defineComponent({
  name: 'ColumnDetail',
  components: {
    PostList
  },
  setup () {
    const route = useRoute()
    const store = useStore<GlabalUserProps>()
    const currentColumnId = route.params.id
    onMounted(() => {
      store.dispatch('fetchColumnsDetail', currentColumnId)
    })
    const column = computed(() => store.getters.getColumnsById(currentColumnId))

    return {
      column,
      currentColumnId
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