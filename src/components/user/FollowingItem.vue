<script setup lang="ts">
import { isEmpty } from 'lodash';
import UserInfoPanel from '@/components/user/UserInfoPanel.vue';
import FollowBtn from '@/components/user/FollowBtn.vue';
import type { UserDataType } from '@/types/userType';
import { getCookies } from '@/utils/common';

const props = defineProps<{
  user: UserDataType;
}>();

const emit =defineEmits <{
  (e: 'refetch'): void;
}>();

const refetch = () => {
  emit('refetch');
};

const { user } = props;
const currentUser = getCookies('uid');
</script>

<template>
  <div
    class="flex justify-between px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
    :key="user._id"
  >
    <UserInfoPanel
      :userId="user._id"
      :account="user.account"
      :name="user.name"
      :avatarUrl="user.avatar"
      :bgColor="user.bgColor"
      class="my-2"
    />
    <div v-if="!isEmpty(currentUser) && user._id !== currentUser" class="relative flex items-center">
      <FollowBtn :user="user" :current-user="currentUser!" @refetch="refetch" />
    </div>
  </div>
</template>
