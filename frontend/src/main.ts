import {createApp} from 'vue'

import App from './App'

import './index.css'

import {router} from './router'

import 'virtual:windi.css'

import {piniaStore} from './stores'
import urql from '@urql/vue';




const app = createApp(App)

app.use(router)
app.use(piniaStore)
console.log(import.meta.env)
app.use(urql, {
  url: import.meta.env.VITE_APP_GRAPHQL_URL,
});

app.mount('#app')

if (__DEV__) {
  window.app = app
}

declare global {
  interface JSON {
    safeParse: typeof JSON.parse
  }
}
JSON.safeParse = (...rest) => {
  try {
    return JSON.parse(...rest)
  } catch (error) {
    return null
  }
}
