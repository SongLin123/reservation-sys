<template>
  <n-page-header
    class="p-15px bg-red-400/50 relative transition duration-500"
    :subtitle="'欢迎回来 ' + (user?.guest_profile?.name || user?.user_name)"
    :style="{
      width: `calc(100% - ${!collapse ? `${sidebarWidth}px` : '100px'})`,
      left: !collapse ? `${sidebarWidth}px` : '100px',
      pointerEvents: isLaptop && !collapse ? 'none' : 'auto',
    }"
  >
    <template #title>
      <a href="https://anyway.fm/" style="text-decoration: none; color: inherit">{{
        route.name == RouteName.AdminMannage
          ? "用户管理"
          : user?.is_guest
          ? "在线为您的午/晚餐选座"
          : "查看预订信息"
      }}</a>
    </template>

    <template #avatar>
      <n-avatar
        src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
      />
    </template>
    <template #extra>
      <n-button @click="handleBack" type="warning">登出</n-button>
    </template>
  </n-page-header>
</template>

<script setup lang="ts">
import { useMessage } from "naive-ui";
import { useRoute } from "vue-router";
import { useStoreRef } from "~/hooks/use-store-ref";
import { RouteName } from "~/router/name";
import { useUIStore } from "~/stores/ui";
import { useUserStore } from "~/stores/user";
const message = useMessage();
const { user, logoutUser } = useStoreRef(useUserStore);

const handleBack = () => {
  logoutUser();
};

const ui = useStoreRef(useUIStore);
const collapse = ui.sidebarCollapse;
const isLaptop = computed(() => ui.viewport.value.mobile || ui.viewport.value.pad);
const sidebarWidth = ui.sidebarWidth;

const route = useRoute();
</script>

<style lang="postcss" scoped></style>
