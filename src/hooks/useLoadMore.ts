import { ref, computed, ComputedRef } from 'vue'
import { useStore } from 'vuex'
interface LoadParams {
  currentPage: number;
  pageSize: number;
}

const useLoadMore = function (actionName: string, total: ComputedRef<number>, params: LoadParams = { currentPage: 2, pageSize: 3 }, cid?: string | string[]) {
  const store = useStore()
  const currentPage = ref(params.currentPage)
  const requestParams = computed(() => ({
    currentPage: currentPage.value,
    pageSize: params.pageSize
  }))
  const loadMorePage = () => {
    if (cid) {
      store.dispatch(actionName, { cid, params: requestParams.value }).then(() => {
        currentPage.value++
      })
    } else {
      store.dispatch(actionName, requestParams.value).then(() => {
        currentPage.value++
      })
    }
  }
  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) < currentPage.value
  })
  return {
    loadMorePage,
    isLastPage,
    currentPage
  }
}

export default useLoadMore