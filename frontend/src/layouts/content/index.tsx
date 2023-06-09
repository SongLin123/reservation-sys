import type { PropType} from 'vue';
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import styles from './index.module.css'

export const ContentLayout = defineComponent({
  props: {
    actionsElement: {
      type: Object as PropType<JSX.Element | null>,
      required: false,
    },
    footerButtonElement: {
      type: Object as PropType<JSX.Element | null>,
      required: false,
    },
    title: {
      type: String,
    },
  },
  setup(props, ctx) {
    const { slots } = ctx
    const router = useRouter()
    const route = computed(() => router.currentRoute)
    const A$ael = () => props.actionsElement ?? null
    const A$fel = () => props.footerButtonElement ?? null
    return () => (
      <>
        <header class={styles['header']}>
          <div class={styles['header-blur']}></div>
          

          <div class={[styles['header-actions'], 'space-x-4']}>
            {props.actionsElement ? <A$ael /> : slots.actions?.()}
          </div>
        </header>
        <main class={styles['main']}>{slots.default?.()}</main>
        <footer class={styles['buttons']}>
          {props.footerButtonElement ? <A$fel /> : slots.buttons?.()}
        </footer>
      </>
    )
  },
})
