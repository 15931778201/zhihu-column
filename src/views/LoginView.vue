<template>
  <div class="login-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">登录到者也</h5>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRef"
          v-model="emailVal"
          placeholder="请输入邮箱地址"
          type="text"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          :rules="passwordRef"
          v-model="passwordVal"
          placeholder="请输入长度为6-16的密码"
          type="password"
        ></validate-input>
      </div>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import _message from '../components/Message/MessageComp'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default defineComponent({
  components: {
    ValidateInput,
    ValidateForm
  },
  setup () {
    const emailVal = ref('')
    const passwordVal = ref('')
    const router = useRouter()
    const store = useStore()
    const emailRef: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const passwordRef: RulesProp = [
      { type: 'required', message: '密码不能为空' },
      { type: 'password', message: '请输入长度为6-16的密码' }
    ]
    const onFormSubmit = (params: boolean) => {
      if (params) {
        const payload = {
          email: emailVal.value,
          password: passwordVal.value
        }
        store.dispatch('fetchAndLogin', payload).then(() => {
          _message.success('登录成功')
          router.push('/')
        }).catch(e => {
          console.log(e)
        })
      }
    }

    return {
      emailRef,
      passwordRef,
      emailVal,
      passwordVal,
      onFormSubmit
    }
  }
})
</script>
<style scoped>
.w-330 {
  max-width: 330px;
}
</style>