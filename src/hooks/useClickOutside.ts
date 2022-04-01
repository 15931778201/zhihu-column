import { ref, onMounted, onUnmounted, Ref } from 'vue';
 
// 该方法判断：当前点击位置是否在某 DOM元素外部，决定是否隐藏下拉菜单
// 此方法接受一个 Ref<null | HTMLElement> 类型的 dom对象
// 注意：响应式 DOM节点 所属类型是 —— Ref，不是小写的 ref
// 只是单纯的 dom对象，在setup()中就不是响应式的
const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  // 是否点击到了外面，默认没有
  const isClickOutside = ref(false);
 
  // 判断点击是否发生在 下拉菜单 DOM元素 外面
  const handler = (e: MouseEvent) => {
    // 如果节点存在
    if(elementRef.value) {
      if(elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false;
      } else {
        isClickOutside.value = true;
      }
    }
  };
 
  // 添加点击事件
  onMounted(() => {
    document.addEventListener('click', handler);
  });
 
  // 移除点击事件
  onUnmounted(() => {
    document.removeEventListener('click', handler);
  });
 
  return isClickOutside;
};
 
export default useClickOutside;