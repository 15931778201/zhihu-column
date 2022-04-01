<template>
  <li class="dropitem-option" :class="{'is-disabled': disabled}">
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DropdownItem',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style>
  .dropitem-option.is-disabled * {
    color: #ccc;
    pointer-events: none;
    background-color: transparent;
  }
</style>