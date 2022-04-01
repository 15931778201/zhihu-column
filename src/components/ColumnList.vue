<template>
  <ul>
    <!-- 专栏列表 -->
    <li v-for="column in list" :key="column.id">
      <img :src="column.avatar" :alt="column.title" />
      <h5>{{ column.title }}</h5>
      <p>{{ column.description }}</p>
      <a href="#"> 进入专栏 </a>
    </li>
  </ul>
</template>
 
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
 
// 引入专栏列表类型接口
import { ColumnProps } from '../interface'

export default defineComponent({
  name: 'ColumnList',
  props: {
    list: {
      type: Array as PropType<ColumnProps[]>,
      required: true
    }
  },
  setup(props) {
   const columnList = computed(() => {
      return props.list.map(column => {
        if(!column.avatar) {
          column.avatar = require('@/assets/column.jpg')
        }
        return column
      })
    })
    return {
      columnList,
    }   
  }  
})
</script>
