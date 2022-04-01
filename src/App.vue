<template>
  <div class="container-fluid px-0 flex-shrink-0">
    <global-header :user="user"></global-header>
    <router-view></router-view>
    <loader
      text="拼命加载中"
      background="rgba(0, 0, 0, .7)"
      v-if="isShowLoading"
     ></loader>
  </div>
  <footer class="text-center py-4 text-secondary bg-light mt-auto">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2020 者也专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
  </footer>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { GlabalUserProps } from './store'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from './components/Loading/LoadingComp.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import _message from './components/Message/MessageComp'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  setup () {
    const store = useStore<GlabalUserProps>()
    const currentUser = computed(() => store.state.user)
    const isShowLoading = computed(() => store.state.loading)
    const error = computed(() => store.state.error)
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        _message.error(message, 3000)
      }
    })
    return {
      user: currentUser,
      isShowLoading,
      error
    }
  }
})
</script>

<style>
.close {
  border: none;
  background: none
}
</style>