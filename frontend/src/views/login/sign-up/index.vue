<template>
  <n-form ref="formRef" inline :label-width="80" :model="userData" :rules="rules">
    <n-form-item label="账号" path="user_name">
      <n-input v-model:value="userData.user_name" placeholder="账号" />
    </n-form-item>
    <n-form-item label="密码" path="password">
      <n-input v-model:value="userData.password" type="password" placeholder="密码" />
    </n-form-item>
    <n-form-item label="姓名" path="guest_profile.name">
      <n-input v-model:value="userData.guest_profile.name" placeholder="姓名" />
    </n-form-item>
    <n-form-item label="联系方式" path="guest_profile.contact_info">
      <n-input
        v-model:value="userData.guest_profile.contact_info"
        placeholder="电话号码"
      />
    </n-form-item>
    <n-form-item>
      <n-space>
        <n-button attr-type="button" @click.prevent="handleValidateClick" type="primary">
          注册
        </n-button>
        <n-button attr-type="button" @click.prevent="emit('back')" type="default">
          返回
        </n-button>
      </n-space>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { FormInst, FormRules, useMessage } from "naive-ui";
import { RESTManager } from "~/utils";

const toast = useMessage();

const rules:FormRules = {
  user_name: {
    required: true,
    message: "请输入姓名",
    trigger: "blur",
  },
  password: {
    required: true,
    message: "请输入密码",
    trigger: "blur",
  },
  guest_profile: {
    name: {
      required: true,
      message: "请输入姓名",
      trigger: "blur",
    },

    contact_info: {
      required: true,
      message: "请输入电话号码",
      trigger: ["input"],
      min:8
    },
  },
};

const userData = ref({
  user_name: "",
  password: "",
  is_guest: true,
  guest_profile: {
    name: "",
    contact_info: "",
  },
});
const formRef = ref<FormInst | null>(null);

const emit = defineEmits(["signSuc", "back"]);

const handleValidateClick = (e: Event) => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const res = await RESTManager.api.signup.post({
        data: userData.value,
      });
      toast.info("注册成功，将自动登录");

      emit("signSuc", {
        user_name: userData.value.user_name,
        password: userData.value.password,
  is_guest: true,

      });
    } else {
      console.log(errors);
    }
  });
};
</script>

<style lang="postcss" scoped></style>
