<template>
  <div class="user-profile-component">
    <div class="d-flex align-items-center">
      <img :src="user.avatar && user.avatar.url" :alt="user.nickName" class="rounded-circle img-thumbnail">
      <div class="detail ml-2">
        <h6 class="d-block mb-0">{{user.nickName}}</h6>
        <span class="text-truncate text-muted d-block">{{user.description}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { UserProps } from '../store'
export default defineComponent({
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup () {
    return {
    }
  }
})
</script>

<style>

.user-profile-component img {
  width: 50px;
  height: 50px;
  /* border: 1px solid #ccc;
  border-radius: 50px; */
}

</style>
