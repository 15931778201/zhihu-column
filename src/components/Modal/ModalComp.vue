<template>
    <div class="modal d-block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="close"></button>
          </div>
          <div class="modal-body">
            <p>{{ content }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="close">{{ cacelText }}</button>
            <button type="button" class="btn btn-primary" @click="confirm">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    title: String,
    content: String,
    cacelText: {
      type: String,
      default: () => {
        return '取消'
      }
    },
    confirmText: {
      type: String,
      default: () => {
        return '确定'
      }
    },
    close: Function,
    confirm: Function
  },
  setup () {
    return {
    }
  }
})
</script>

<style scoped>
  .modal {
    background: rgba(0, 0, 0, .6)
  }
</style>