<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { isEmpty } from 'lodash';
import { bgColorConvert } from '@/utils/common';

const props = defineProps<{
  name: string;
  avatarUrl: string;
  size: string;
  textSize: string;
  bgColor: string;
}>();

const { name, avatarUrl, size, textSize, bgColor } = props;
const avatarName = name.substring(0, 1).toUpperCase();
const colorStyle = bgColorConvert(bgColor);

</script>

<template>
  <template v-if="isEmpty(avatarUrl)">
    <template v-if="name">
      <span
        :class="[size, colorStyle, 'rounded-full flex justify-center items-center font-semibold cursor-default']"
      >
        <p :class="[textSize, 'text-center text-white']">{{ avatarName }}</p>
      </span>
    </template>
    <template v-else>
      <span :class="[size, 'rounded-full flex justify-center items-center border']">
        <FontAwesomeIcon
          :icon="icon({ prefix: 'fas', iconName: 'user' })"
          class="w-8 h-8 text-gray-500"
        />
      </span>
    </template>
  </template>
  <template v-else>
    <img :class="[size, 'rounded-full']" :src="avatarUrl" alt="avatar" />
  </template>
</template>