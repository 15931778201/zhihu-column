<template>
  <div class="dropdown" ref="dropdownRef">
    <!-- 下拉框切换按钮 - 点击实现菜单展开折叠的切换 -->
    <a href="#" @click.prevent="toggleOpen">{{ title }}</a>
    <!-- 下拉菜单 -->
    <ul class="dropdown-menu" :style="{ display: 'block' }" v-if="isOpen">
      <slot></slot>
    </ul>
  </div>
</template>
 
<script lang="ts">
  import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
  export default defineComponent({
    name: 'DropdownComp',
    props: {
      // 用户名
      title: {
        type: String,
        required: true
      }
    },
    setup() {
      // 菜单状态，默认关闭
      const isOpen = ref(false);
      // 此处命名需要和 template 中的 ref 相同，才能获取 DOM对象
      const dropdownRef = ref<null | HTMLElement>(null);
      // 切换菜单状态的方法
      const toggleOpen = () => {
        isOpen.value = !isOpen.value
      };
      // 判断点击是否发生在 下拉菜单 DOM元素 外面
      const handler = (e: MouseEvent) => {
        if(dropdownRef.value) {
          // 如果 下拉菜单内的DOM元素 不包含 当前点击的位置，且菜单处于开启状态
          if(!dropdownRef.value.contains(e.target as HTMLElement) && isOpen.value) {
            // 关闭菜单
            isOpen.value = false;
          }
        }
      };     

      onMounted(() => {
        document.addEventListener("click", handler);
      });
 
      onUnmounted(() => {
        document.removeEventListener("click", handler);
      });       
      return {
        isOpen,
        toggleOpen
      }
    }
  })
</script>