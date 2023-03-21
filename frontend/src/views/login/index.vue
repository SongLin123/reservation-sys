<script lang="ts">
import { useMessage } from "naive-ui";
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

import Avatar from "../../components/avatar/index.vue";
import ParallaxButtonVue from "../../components/button/parallax-button.vue";
import { useStoreRef } from "../../hooks/use-store-ref";
import type { UserModel } from "../../models/user";
import { useUserStore } from "../../stores/user";
import { RESTManager } from "../../utils/rest";
import SignUpVue from "./sign-up/index.vue";

export const LoginView = defineComponent({
  components: { Avatar, ParallaxButtonVue, SignUpVue },
  setup() {
    const loaded = ref(false);
    const { updateToken } = useStoreRef(useUserStore);
    const router = useRouter();
    onMounted(() => {});

    onUnmounted(() => {
      document.onkeydown = null;
    });

    const toast = useMessage();

    const loginData = ref({
      user_name: "user1",
      password: "12345678",
      is_guest: true,
    });

    const handleLogin = async (e?: Event, userData?) => {
      e?.stopPropagation();
      try {
        userData && (loginData.value = userData);

        const res = await RESTManager.api.users.login.post<{
          token: string & UserModel;
        }>({
          data: loginData.value,
        });
        updateToken(res.token);

        router.push("/dashboard");
        toast.success("欢迎回来");
      } catch (e) {
        toast.error("登陆失败");
      }
    };

    const showSignUp = ref(false);

    const handleSignup = (e: Event) => {
      showSignUp.value = true;
    };

    const handleChange = () => {
      loginData.value = {
        user_name: "eye1",
        password: "11111111",
        is_guest: false,
      };
    };
    return {
      loaded,
      showSignUp,
      handleLogin,
      handleSignup,
      handleChange,
      loginData,
    };
  },
});

export default LoginView;
</script>

<template>
  <div class="wrapper">
    <n-form ref="formRef" inline :label-width="80" v-if="!showSignUp">
      <n-form-item label="登陆身份">
        <n-radio-group
          v-model:value="loginData.is_guest"
          @update:value="handleChange"
          style="background-color: #fff"
        >
          <n-radio-button :value="true" :label="'客户'" />
          <n-radio-button :value="false" :label="'员工'" />
        </n-radio-group>
      </n-form-item>

      <n-form-item label="账号" path="name">
        <n-input v-model:value="loginData.user_name" placeholder="账号" />
      </n-form-item>
      <n-form-item label="密码" path="password">
        <n-input v-model:value="loginData.password" type="password" placeholder="密码" />
      </n-form-item>
      <n-form-item>
        <n-space>
          <n-button attr-type="button" @click.prevent="handleLogin" type="primary">
            登录
          </n-button>
          <n-button attr-type="button" @click.prevent="showSignUp = true" type="default">
            客户注册
          </n-button>
        </n-space>
      </n-form-item>
    </n-form>

    <SignUpVue
      v-else
      @back="showSignUp = false"
      @signSuc="handleLogin(undefined, $event)"
    ></SignUpVue>
  </div>
</template>

<style scoped="">
@import "./index.css";
</style>
