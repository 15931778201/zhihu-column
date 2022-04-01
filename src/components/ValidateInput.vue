<template>
  <div class="validate-input-container pb-3">
    <input type="text"
      v-if="tag !== 'textarea'"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      v-model="inputRef.val"
      v-bind="$attr"
      @blur="validateInput"
    >
  <textarea
    v-else
    class="form-control"
    v-model="inputRef.val"
    v-bind="$attrs"
    :class="{'is-invalid': inputRef.error }"
    @blur="validateInput"
  />    
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, onMounted, computed } from 'vue'
import { emitter } from './ValidateForm.vue'

const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
interface RuleProp {
  type: 'required' | 'email' | 'password' | 'custom';
  message: string;
  validator?: () => boolean;
}
type tagProps = 'input' | 'textarea'
export type RulesProp = RuleProp[]
export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<tagProps>,
      default: 'input'
    }    
  },
  setup(props, ctx) {
    const inputRef = reactive({
      val: computed({
        get: () => props.modelValue || '',
        set: val => {
          ctx.emit('update:modelValue', val)
        }
      }),      
      error: false,
      message: ''
    })
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            case 'password':
              passed = inputRef.val.trim().length > 5 && inputRef.val.trim().length < 17
              break
            case 'custom':
              passed = rule.validator ? rule.validator() : true
              break              
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
    }
    // 将事件发射出去，其实就是把验证函数发射出去
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
    }) 
    return {
      inputRef,
      validateInput,
    }
  }
})
</script>