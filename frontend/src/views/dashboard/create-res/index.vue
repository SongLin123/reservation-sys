<template>
  <n-button type="primary" strong @click="showModal = true"> 添加预约 </n-button>

  <n-modal v-model:show="showModal" preset="dialog" title="Dialog">
    <template #header>
      <div>创建预约</div>
    </template>
    <n-form
      ref="formRef"
      :model="resData"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
      size="medium"
      :style="{
        maxWidth: '640px',
      }"
    >
      <n-form-item label="table_size" path="table_size">
        <n-select
          v-model:value="resData.table_size"
          placeholder="table_size"
          :options="allowTable_size"
        />
      </n-form-item>
      <n-form-item label="date_day_time" path="date_day_time">
        <n-radio-group
          :disabled="!resData.table_size"
          v-model:value="resData.date_day_time"
          name="radiogroup"
        >
          <n-space>
            <n-radio v-for="i in times" :key="i" :value="i">
              {{ i }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>

      <n-form-item label="date_day" path="date_day">
        <n-date-picker
          ref="datePick"
          :disabled="!resData.table_size || !resData.date_day_time"
          v-model:formatted-value="resData.date_day"
          value-format="yyyy-MM-dd"
          :is-date-disabled="dateDisabled"
          type="date"
        >
        </n-date-picker>
      </n-form-item>
    </n-form>

    <template #action>
      <NSpace>
        <NButton @click="cancel()"> 取消 </NButton>
        <NButton type="primary" @click="handlePost()"> 提交 </NButton>
      </NSpace>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { DatePickerInst, FormInst, FormRules, NButton, NSpace, useMessage } from "naive-ui";
import { Component, ComponentPublicInstance, onBeforeMount, ref } from "vue";
import { RESTManager } from "~/utils";
import dayjs from "dayjs";

const emit = defineEmits(["freshTable"]);
const message = useMessage();
const showModal = ref(false);

const formRef = ref<FormInst | null>(null);
const datePick = ref<ComponentPublicInstance | null>(null);
  

const rules: FormRules = {
  date_day: {
    required: true,
  },
  date_day_time: {
    required: true,
  },
  table_size: {
    required: true,
  },
};


const resData = ref({
  date_day: dayjs().add(1,'days').format("YYYY-MM-DD"),
  date_day_time: "",
  table_size: "",
});

const cancel = () => {
  showModal.value = false;
  
  formRef.value?.restoreValidation();
  resData.value = {
    date_day: dayjs().add(1,'days').format("YYYY-MM-DD"),
    date_day_time: "",
    table_size: "",
  };
};

const handlePost = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      createResvertion();
    } else {
      console.log(errors);
    }
  });
};

const createResvertion = async () => {
  await RESTManager.api["reservation-records"].create.post({
    data: resData.value,
  });

  message.info("预约创建成功");
  cancel();
  emit("freshTable");
};

const times = ["noon", "evening"];

let allowDayTime: { date_day: string; date_day_time: string }[] = [];
const dateDisabled = (ts: number) => {
  const date = dayjs(ts).format("YYYY-MM-DD");

  return !allowDayTime.find((i) => {
    return i.date_day == date && dayjs(i.date_day).isAfter( dayjs());
  });
};

const searchAllowDate = async () => {
  const { table_size, date_day_time } = resData.value;
  allowDayTime = (
    await RESTManager.api["available-date"].get<{ data; code }>({
      params: {
        table_size,
        date_day_time,
      },
    })
  ).data;
};

const allowTable_size = ref([]);

onBeforeMount(async () => {
  // 可选桌
  allowTable_size.value = (
    await RESTManager.api["available-table-size"].get<{ data; code }>()
  ).data.map((i) => ({
    label: i,
    value: i,
  }));

  watch(() => {
    const { table_size, date_day_time } = resData.value;
    if (table_size && date_day_time) {
      return resData.value.table_size + resData.value.date_day_time;
    }
  }, searchAllowDate);
});
</script>

<style lang="scss" scoped></style>
