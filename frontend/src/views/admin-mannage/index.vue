<template>
  <ContentLayout>
    <NButton @click="addEye()" type="primary">添加员工</NButton>
    <NP :loading="res.fetching">
      <div v-if="res.error.value">Oh no... {{ res.error.value }}</div>
      <div v-else>
        <n-data-table
          v-if="res.data.value"
          :columns="columns"
          :data="res.data.value!.users"
          :bordered="false"
        />
      </div>
    </NP>
  </ContentLayout>

  <n-modal v-model:show="userProfileModal.showModal.value" preset="dialog" title="Dialog">
    <template #header>
      <div>修改客户资料</div>
    </template>
    <n-form
      :ref="(el) => (userProfileModal.formRef = el)"
      :model="userProfileModal.resData"
      :rules="userProfileModal.rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
      size="medium"
      :style="{
        maxWidth: '640px',
      }"
    >
      <n-form-item label="客户姓名" path="name">
        <n-input v-model:value="userProfileModal.resData.name" />
      </n-form-item>
      <n-form-item label="联系方式" path="contact_info">
        <n-input v-model:value="userProfileModal.resData.contact_info" />
      </n-form-item>
    </n-form>

    <template #action>
      <NSpace>
        <NButton @click="userProfileModal.cancel()"> 取消 </NButton>
        <NButton type="primary" @click="updateUser()"> 提交 </NButton>
      </NSpace>
    </template>
  </n-modal>

  <n-modal v-model:show="userCreateModal.showModal.value" preset="dialog" title="Dialog">
    <template #header>
      <div>创建员工账号</div>
    </template>
    <n-form
      ref="formRef"
      :model="userCreateModal.resData"
      :rules="userCreateModal.rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
      size="medium"
      :style="{
        maxWidth: '640px',
      }"
    >
      <n-form-item label="用户名" path="user_name">
        <n-input v-model:value="userCreateModal.resData.user_name" />
      </n-form-item>
      <n-form-item label="密码" path="password">
        <n-input v-model:value="userCreateModal.resData.password" />
      </n-form-item>
    </n-form>

    <template #action>
      <NSpace>
        <NButton @click="userCreateModal.cancel()"> 取消 </NButton>
        <NButton type="primary" @click="createUser()"> 提交 </NButton>
      </NSpace>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { FormInst, FormRules, NButton, NIcon, NP, NSpace, NTag, useMessage } from "naive-ui";
import { ContentLayout } from "~/layouts/content";
import Refresh from "~icons/material-symbols/refresh-rounded";

import type { DataTableColumns } from "naive-ui";
import { h } from "vue";
import { useStoreRef } from "~/hooks/use-store-ref";
import { GuestProfile, GuestUser } from "~/models/base";
import { useUserStore } from "~/stores/user";
import { useGraphql } from "./graphql.hook";

import { useModal } from "./modal.hook";

const columns: DataTableColumns<GuestUser> = [
  {
    title: "账户类型",
    key: "is_guest",
    render(row) {
      return row.is_guest ? h(NTag,{ type:"success"},"客户") : h(NTag,{type:"info"},"员工");
    },
  },
  {
    title: "用户名",
    key: "user_name",
  },

  {
    title: "用户信息",
    key: "guest_profile",
    render(row) {
      return h("div", [
        row.guest_profile?.name && h("div", `客户姓名：${row.guest_profile?.name || ""}`),
        row.guest_profile?.contact_info &&
          h("div", `联系方式：${row.guest_profile?.contact_info || ""}`),
      ]);
    },
  },
  {
    title: "账户状态",
    key: "state",
    render(row) {
      switch (row.state) {
        case "disable":
          return "停用";
        case "enable":
        default:
          return "启用";
      }
    },
  },
  {
    title: "操作",
    key: "ac",
    render(row) {
      return h(NSpace, [
        h(
          NButton,
          {
            strong: true,
            size: "small",
            onClick: () => updateProfile(row),
            disabled: !row.is_guest,
            type: "primary",
          },
          {
            default: () => "编辑",
          }
        ),
        h(
          NButton,
          {
            strong: true,
            size: "small",
            onClick: () => changeStatus(row),
            disabled: row.is_guest,
            type: "primary",
          },
          {
            default: () => {
              switch (row.state) {
                case "disable":
                  return "启用";

                case "enable":
                default:
                  return "停用";
              }
            },
          }
        ),
      ]);
    },
  },
];

const message = useMessage();
const dialog = useDialog();
const changeStatus = async (row: GuestUser) => {
  dialog.warning({
    title: "警告",
    content: `你确定${row.state == "disable" ? "启用" : "停用"}用户？`,
    positiveText: "确定",
    negativeText: "不确定",
    onPositiveClick: async () => {
      await userStateMutation.executeMutation({
        state: row.state == "disable" ? "enable" : "disable",
        updateUserStateId: row.id,
      });

      message.info(`更新成功`);
    },
    onNegativeClick: () => {},
  });
};

const userProfileModal = useModal<GuestProfile>(
  {
    name: "",
    contact_info: "",
  },
  {
    name: {
      required: true,
    },
    contact_info: {
      required: true,
    },
  }
);

let userid;
const updateProfile = async (row: GuestUser) => {
  userProfileModal.showModal.value = true;
  userid = row.id;

  const { name, contact_info } = row.guest_profile
    ? { ...row.guest_profile }
    : { name: "", contact_info: "" };

  Object.assign(userProfileModal.resData, { name, contact_info });
};

const {
  usersQuery,
  userStateMutation,
  userProfileMutation,
  adduserMutation,
} = useGraphql();

const res = usersQuery();

const updateUser = () => {
  userProfileModal.handlePost().then(async () => {
    const { name, contact_info } = userProfileModal.resData;
    userProfileMutation
      .executeMutation({
        guestProfile: { name, contact_info },
        updateUserProfileId: userid,
      })
      .then((result) => {
        if (result.error) {
          console.error("Oh no!", result.error);
          return;
        }
        message.info(`更新成功`);
        userProfileModal.cancel();
      });
  });
};


const addEye = ()=>{
  userCreateModal.showModal.value = true;

}

const userCreateModal = useModal(
  {
    password: "",
    user_name: "",
  },
  {
    user_name: {
      required: true,
    },
    password: {
      required: true,
    },
  }
);

const createUser = () => {
  userCreateModal.handlePost().then(async () => {
    const { password, user_name } = userCreateModal.resData;
    adduserMutation
      .executeMutation({
        userReq:{
          is_guest: false,
        password,
        user_name,
        }
      })
      .then((result) => {
        if (result.error) {
          console.error("Oh no!", result.error);
          return;
        }
        message.info(`更新成功`);
        userCreateModal.cancel();
      });
  });
};
</script>
