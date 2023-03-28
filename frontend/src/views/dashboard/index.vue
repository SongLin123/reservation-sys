<template>
  <ContentLayout>
    <NP>
      <div
        style="display: flex; justify-content: space-between; flex-direction: row-reverse"
      >
        <n-button strong secondary circle @click="freshData()" :loading="loading">
          <template #icon>
            <NIcon><Refresh /></NIcon>
          </template>
        </n-button>

        <CreateRes v-if="user?.is_guest" @freshTable="freshData()" />
      </div>
      <n-data-table :columns="columns" :data="data" :bordered="false" />
    </NP>
  </ContentLayout>
</template>

<script setup lang="ts">
import { NButton, NIcon, NP, useMessage } from "naive-ui";
import { ContentLayout } from "~/layouts/content";
import Refresh from "~icons/material-symbols/refresh-rounded";

import type { DataTableColumns } from "naive-ui";
import { h } from "vue";
import { useStoreRef } from "~/hooks/use-store-ref";
import { RecordStatusEnum, ResvertionRecord } from "~/models/base";
import { useUserStore } from "~/stores/user";
import { RESTManager } from "~/utils";
import CreateRes from "./create-res/index.vue";
const createColumns = ({
  changeStatus,
}: {
  changeStatus: (row: ResvertionRecord) => void;
}): DataTableColumns<ResvertionRecord> => {
  return [
    {
      title: "客人信息",
      key: "guest_user_id",
      render(row) {
        return h("div", [
          h("div", `客人姓名 ${row.guest_user.guest_profile.name}`),
          h("div", `联系方式 ${row.guest_user.guest_profile.contact_info}`),
        ]);
      },
    },
    {
      title: "预定时间",
      key: "date_reservation.date_day",
      render(row) {
        return `${row.date_reservation?.date_day}  ${
          row.date_reservation?.date_day_time == "noon" ? "午餐" : "晚餐"
        }`;
      },
    },
    {
      title: "预定桌位",
      key: "date_reservation_id",
      render(row) {
        return `${row.date_reservation?.tables?.table_size}人桌 ${row.date_reservation?.tables?.table_num}号桌`;
      },
    },
    {
      title: "预定状态",
      key: "actions",
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            size: "small",
            onClick: () => changeStatus(row),
            disabled: RecordStatusEnum.CANCELED == row.record_status,
            type:
              RecordStatusEnum.APPOINTMENT_IN_PROGRESS == row.record_status
                ? "primary"
                : "warning",
          },
          {
            default: () => {
              switch (row.record_status) {
                case RecordStatusEnum.APPOINTMENT_IN_PROGRESS:
                  return "预约中";
                case RecordStatusEnum.CANCELED:
                  return "已取消";

                default:
                  break;
              }
            },
          }
        );
      },
    },
  ];
};

const { user } = useStoreRef(useUserStore);
const data = ref<ResvertionRecord[]>([]);

const message = useMessage();
const dialog = useDialog();

const columns = createColumns({
  async changeStatus(row: ResvertionRecord) {
    dialog.warning({
      title: "警告",
      content: "你确定取消预约？",
      positiveText: "确定",
      negativeText: "不确定",
      onPositiveClick: async () => {
        const statu =
          row.record_status == RecordStatusEnum.CANCELED
            ? RecordStatusEnum.APPOINTMENT_IN_PROGRESS
            : RecordStatusEnum.CANCELED;
        await RESTManager.api["reservation-records"].update[row.id].patch({
          data: {
            record_status: statu,
          },
        });
        message.info(`预约状态更新成功`);

        freshData();
      },
      onNegativeClick: () => {},
    });
  },
});

const loading = ref(false);
const freshData = async () => {
  loading.value = true;
  data.value = (await RESTManager.api["reservation-records"].get<any>()).data;
  loading.value = false;
};

const createResvertion = async () => {};

onMounted(async () => {
  freshData();
});
</script>
