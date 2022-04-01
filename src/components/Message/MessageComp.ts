import { createApp } from 'vue'
import Message from './MessageComp.vue'

type MessageType = 'success' | 'error' | 'default'

const _message = {
  createMessge (message: string, type: MessageType, timeout = 2000) {
    const messageInstance = createApp(Message, {
      message,
      type
    })
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)
    messageInstance.mount(mountNode)
    setTimeout(() => {
      document.body.removeChild(mountNode)
    }, timeout)
  },
  success (message: string, timeout = 2000) {
    this.createMessge(message, 'success', timeout)
  },
  error (message: string, timeout = 2000) {
    this.createMessge(message, 'error', timeout)
  }
}
export default _message