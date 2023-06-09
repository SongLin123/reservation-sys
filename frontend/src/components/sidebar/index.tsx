import { API_URL } from 'constants/env'
import { NLayoutContent , NIcon as Icon } from 'naive-ui'
import type { PropType} from 'vue';
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Hamburger from '~icons/material-symbols/menu'

import { useStoreRef } from '~/hooks/use-store-ref'
import { useUserStore } from '~/stores/user'

import type { MenuModel} from '../../utils/build-menus';
import { buildMenus } from '../../utils/build-menus'
import { Avatar } from '../avatar'
import styles from './index.module.css'

export const Sidebar = defineComponent({
  name: 'SidebarComp',
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    onCollapseChange: {
      type: Function as PropType<{ (status: boolean): void }>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()
    const { user } = useStoreRef(useUserStore)
    const route = computed(() => router.currentRoute.value)
    const menus = ref<MenuModel[]>([])
    onMounted(() => {
      // @ts-expect-error
      menus.value = buildMenus(router.getRoutes())
    })

    const _index = ref(0)

    function updateIndex(index: number) {
      if (index === _index.value) {
        _index.value = -1
        return
      }
      _index.value = index
    }

    function handleRoute(item: MenuModel, index?: number) {
      if (item.subItems?.length) {
      } else {
        // console.log(item.fullPath)

        router.push({
          path: item.fullPath,
          query: item.query,
        })
        if (index) {
          updateIndex(index)
        }
      }
    }
    const tlname = user.value?.guest_profile?.name || user.value?.user_name;
    return () => (
      <div
        class={[styles['root'], props.collapse ? styles['collapse'] : null]}
        style={{
          width: !props.collapse && props.width ? `${props.width}px` : '',
        }}
      >
        <div
          class={
            `fixed left-0 top-0 h-screen overflow-hidden z-10 text-white ${ 
            styles['sidebar']}`
          }
        >
          <div class={'title relative font-medium text-center text-2xl'}>
            <h1 class="py-6" style={{ display: props.collapse ? 'none' : '' }}>
              {tlname}
            </h1>
            <button
              class={styles['collapse-button']}
              onClick={() => {
                props.onCollapseChange?.(!props.collapse)
              }}
            >
              <Icon>
                <Hamburger />
              </Icon>
            </button>
          </div>

          <NLayoutContent class={styles['menu']} nativeScrollbar={false}>
            <div class={styles['items']}>
              {menus.value.map((item, index) => {
                return (
                  <div
                    class={[
                      'py-2',
                      route.value.fullPath === item.fullPath ||
                      route.value.fullPath.startsWith(item.fullPath)
                        ? styles['active']
                        : '',

                      styles['item'],
                    ]}
                    data-path={item.fullPath}
                  >
                    <button
                      key={item.title}
                      class={'py-2 flex w-full items-center'}
                      onClick={
                        item.subItems?.length
                          ? () => updateIndex(index)
                          : () => handleRoute(item, index)
                      }
                    >
                      <span
                        style={{ flexBasis: '3rem' }}
                        class="flex justify-center"
                      >
                        {item.icon}
                      </span>
                      <span class={styles['item-title']}>{item.title}</span>
                    </button>
                    {item.subItems && (
                      <ul
                        class={[
                          `overflow-hidden  ${ 
                            item.subItems.length ? styles['has-child'] : ''}`,
                          _index.value === index ? styles['expand'] : '',
                        ]}
                        style={{
                          maxHeight:
                            _index.value === index
                              ? `${item.subItems.length * 3.5}rem`
                              : '0',
                        }}
                      >
                        {item.subItems.map((child) => {
                          return (
                            <li
                              key={child.path}
                              // data-fullPath={child.fullPath}
                              class={[
                                route.value.fullPath === child.fullPath ||
                                route.value.fullPath.startsWith(child.fullPath)
                                  ? styles['active']
                                  : '',
                                styles['item'],
                              ]}
                            >
                              <button
                                onClick={() => handleRoute(child)}
                                class={'flex w-full items-center py-4'}
                              >
                                <span
                                  class="flex justify-center items-center"
                                  style={{ flexBasis: '3rem' }}
                                >
                                  {child.icon}
                                </span>
                                <span class={styles['item-title']}>
                                  {child.title}
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          </NLayoutContent>

        </div>
      </div>
    )
  },
})
