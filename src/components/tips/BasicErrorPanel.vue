<script setup lang="ts">
import { isEmpty } from 'lodash';

const props = defineProps<{
  errorMsg: string;
}>();

const { errorMsg } = props;
</script>

<template>
  <div class="flex justify-center mt-10">
    <p class="text-3xl">{{ !isEmpty(errorMsg) ? errorMsg : '發生一些錯誤，請稍後再試!!'}}</p>
  </div>
</template>
