<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <a class="navbar-brand" href="#">第五人格专栏</a>
    <!-- 用户未登录时，显示登录注册按钮 -->
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item">
        <router-link to="/login" class="btn btn-outline-light my-2">登录</router-link>      
      </li>
      <li class="list-inline-item">
        <router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link>      
      </li>
    </ul>
    <!-- 用户登录时，显示下拉菜单 -->
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <!-- 使用模板字符串 -->
        <dropdown :title="`你好 ${user.name}`">
          <dropdown-item>
            <router-link to="/create" class="dropdown-item">新建文章</router-link>
          </dropdown-item>
          <dropdown-item>
            <router-link :to="`/column/${user.column}`" class="dropdown-item">我的专栏</router-link>
          </dropdown-item>
          <dropdown-item disabled>
            <a href="#" class="dropdown-item">编辑资料</a>
          </dropdown-item>          
          <dropdown-item>
            <router-link to="" class="dropdown-item" @click.prevent="logout">退出登录</router-link>
          </dropdown-item>          
        </dropdown>        
      </li>
    </ul>
  </nav>
</template>
 
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import _message from '../components/Message/MessageComp'
import { UserProps, GlabalUserProps } from '../store/index'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'GlobalHeader',
  components: { Dropdown, DropdownItem }, 
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup() {
    const store = useStore<GlabalUserProps>()
    const router = useRouter()
    const logout = () => {
      store.commit('setLoading', true)
      setTimeout(() => {
        store.commit('setLoading', false)
        store.commit('logout')
        router.push({ name: 'login' })
        _message.success('退出登录成功')
      }, 1000)
    }
    return {
      logout
    }
  }
})
</script>