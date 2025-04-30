<script setup lang="ts">
import { ref } from 'vue';
import type { UserDataType } from '@/types/userType';
import { errorAlert } from '@/utils/fetch';
import { changeFollowState, followUser, unfollowUser } from '@/api/follow';

const props = defineProps<{
  user: UserDataType;
  currentUser: string;
}>();

const emit = defineEmits<{
  (e: 'refetch'): void;
}>();

const refetch = () => {
  emit('refetch');
};

const { user, currentUser } = props;
const activeDropdown = ref('');

/** 控制下拉選單 */
const toggleDropdown = (id: string) => {
  activeDropdown.value = activeDropdown.value === id ? '' : id;
};

/** 追蹤 */
const handleFollow = async () => {
  const res = await followUser(currentUser!, user._id);
  if (res.status === 200) {
    toggleDropdown('');
    refetch();
  } else {
    errorAlert();
  }
};

/** 取消追蹤 */
const handleUnfollow = async () => {
  const res = await unfollowUser(currentUser!, user._id);
  if (res.status === 200) {
    toggleDropdown('');
    refetch();
  } else {
    errorAlert();
  }
};

/** 更改訂閱狀態 */
const handleChangeState = async (state: number) => {
  const res = await changeFollowState(currentUser!, user._id, state);
  if (res.status === 200) {
    toggleDropdown('');
    refetch();
  } else {
    errorAlert();
  }
};
</script>

<template>
  <div class="relative flex items-center">
    <button
      v-if="user.isFollow"
      type="button"
      class="py-1 px-3 rounded-lg text-white bg-gray-500"
      @click="() => toggleDropdown(user._id)"
    >
      追蹤中
      <font-awesome-icon :icon="['fas', 'caret-down']" class="ml-1" />
    </button>
    <button
      v-else
      type="button"
      class="py-1 px-3 rounded-lg text-white bg-green-600"
      @click="() => handleFollow()"
    >
      追蹤
    </button>
      <div className="absolute w-28 border rounded-lg py-2 px-1 top-12 right-0 bg-white dark:bg-gray-950 dark:border-gray-600 z-50">
      <button
        v-if="user.followState === 1"
        type="button"
        class="text-left w-full py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-700"
        @click="() => handleChangeState(0)"
      >
        關閉通知
      </button>
      <button
        v-else
        type="button"
        class="text-left w-full py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-700"
        @click="() => handleChangeState(1)"
      >
        開啟通知
      </button>
      <button
        type="button"
        class="text-left w-full py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-700"
        @click="() => handleUnfollow()"
      >
        取消追蹤
      </button>
    </div>
    <div class="fixed z-40 top-0 left-0 w-full h-full" @click="() => toggleDropdown('')" />
  </div>
</template>