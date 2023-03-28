import {NIcon as Icon} from 'naive-ui';
import type {
  RouteRecordRaw
} from 'vue-router';
import {
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router';
import {useStoreRef} from '~/hooks/use-store-ref';
import {useUserStore} from '~/stores/user';
import UilTachometerFast from '~icons/uil/tachometer-fast';

import SetupLayout from '../layouts/setup-view.vue';
import {SidebarLayout} from '../layouts/sidebar';
import AdminMannage from '../views/admin-mannage/index.vue';
import DashBoardView from '../views/dashboard/index.vue';
import LoginView from '../views/login/index.vue';
import {RouteName} from './name';



const routeForMenu: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    component: DashBoardView,
    name: RouteName.Dashboard,
    meta: {
      title: '预约列表',
      icon: (
        <Icon>
          <UilTachometerFast />
        </Icon>
      ),
    },
  },
  {
    path: '/admin-mannage',
    component: AdminMannage,
    name: RouteName.AdminMannage,
    meta: {
      title: '用户管理',
      icon: (
        <Icon>
          <UilTachometerFast />
        </Icon>
      ),
      hide: () => {
        const {user} = useStoreRef(useUserStore);
        if (!user.value) return true
        return user.value.is_guest

      }
    },
  },
]

export const router = createRouter({
  history: __DEV__ ? createWebHistory() : createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: SidebarLayout,
      name: RouteName.Home,
      redirect: '/dashboard',
      children: [...routeForMenu],
    },

    {
      component: SetupLayout,
      path: '/',
      children: [
        {
          path: '/setup-api',
          meta: {isPublic: true, title: '设置接口地址'},
          component: () => import('../views/setup/setup-api'),
        },
        {
          path: '/login',
          name: RouteName.Login,
          meta: {isPublic: true, title: '登陆'},
          component: LoginView,
        },
      ],
    },

    {
      path: '/:pathMatch(.*)*',
      name: '404',
      meta: {isPublic: true},
      redirect: '/',
    },
  ],
})

