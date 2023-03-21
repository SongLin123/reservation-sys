<script lang="ts">

export default defineComponent({
  setup() {
    const loaded = ref(false)

    onMounted(() => {
    })

    return {
    }
  },
})
</script>

<template>
  <div>
    <div
      class="bg"
    />

    <router-view />
  </div>
</template>

<style scoped lang="postcss">
.bg {
  @apply fixed top-0 left-0 right-0 bottom-0;
  @apply bg-cover bg-center bg-no-repeat -m-4 bg-gray-600 ease-linear transition-opacity duration-700;

  filter: blur(5px);
}
</style>
