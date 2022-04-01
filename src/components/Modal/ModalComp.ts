import { createApp } from 'vue'
import Modal from './ModalComp.vue'

interface Options {
  title: string;
  content: string;
  cacelText?: string;
  confirmText?: string;
  close?: () => void;
  confirm?: () => void;
}
const modal = function (options = {} as Options) {
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  const messageInstance = createApp(Modal, {
    ...options,
    close: () => {
      messageInstance.unmount()
      document.body.removeChild(mountNode)
      options.close && options.close()
    },
    confirm: () => {
      messageInstance.unmount()
      document.body.removeChild(mountNode)
      options.confirm && options.confirm()
    },
    render: (h: any) => {
      return h('div', 'hello')
    }
  })
  messageInstance.mount(mountNode)
}
export default modal