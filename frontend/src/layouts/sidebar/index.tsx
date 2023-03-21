import $RouterView from 'layouts/router-view'
import {NLayoutContent} from 'naive-ui'
import {defineComponent, watchEffect} from 'vue'

import {useStoreRef} from '~/hooks/use-store-ref'
import {useUserStore} from '~/stores/user'

import PageHead from '../../components/page-head/page-head.vue'
import {useUIStore} from '../../stores/ui'

export const SidebarLayout = defineComponent({
  name: 'SidebarLayout',

  setup() {
    const ui = useStoreRef(useUIStore)


    const {fetchUser} = useStoreRef(useUserStore)

    onMounted(() => {

      fetchUser()
    })

    const collapse = ui.sidebarCollapse
    watchEffect(() => {
      // console.log(ui.viewport)
      collapse.value = ui.viewport.value.mobile ? true : false
    })

    const sidebarWidth = ui.sidebarWidth

    const isLaptop = computed(
      () => ui.viewport.value.mobile || ui.viewport.value.pad,
    )

    return () => (
      <div >

        <PageHead
        />
        {/* <Sidebar
          collapse={collapse.value}
          width={sidebarWidth.value}
          onCollapseChange={(s) => {
            collapse.value = s
          }}
        /> */}

        <NLayoutContent
          embedded
          nativeScrollbar={false}
          style={{
            // left: !collapse.value ? `${sidebarWidth.value}px` : '100px',
            // pointerEvents: isLaptop.value && !collapse.value ? 'none' : 'auto',
            // top: '40px',
          }}
        >
          <$RouterView />
        </NLayoutContent>
      </div>
    )
  },
})
