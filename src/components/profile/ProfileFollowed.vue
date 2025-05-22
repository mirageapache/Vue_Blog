<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { isEmpty } from 'lodash';
import NoSearchResult from '../tips/NoSearchResult.vue';
import UserListDynamic from '../user/userListDynamic.vue';
import type { UserDataType } from '@/types/userType';
import { getFollowerList } from '@/api/follow';

const props = defineProps<{
  userId: string;
  identify: boolean;
}>();

const { userId, identify } = props;
const isLoading = ref(false);
const followerList = ref<UserDataType[]>([]);
const nextPage = ref(1);

const fetchFollowedUser = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await getFollowerList(userId, nextPage.value);
    if (res) {
      followerList.value.push(...res.followList);
      nextPage.value = res.nextPage;
    }
  } finally {
    isLoading.value = false;
  }
};

/** 滾動判斷fetch新資料 */
const handleScroll = () => {
  if (
    window.innerHeight + document.documentElement.scrollTop >=
    document.documentElement.offsetHeight - 350
  ) {
    if (nextPage.value > 0) fetchFollowedUser();
  }
};

onMounted(() => {
  fetchFollowedUser();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <template v-if="isEmpty(followerList) && !isLoading">
    <NoSearchResult
      v-if="identify"
      msgOne="你還沒有粉絲喔"
      msgTwo="快去拓展你的粉絲圈吧"
      type="user"
    />
    <NoSearchResult
      v-else
      msgOne="沒有任何粉絲資訊"
      msgTwo=""
      type="user"
    />
  </template>
  <template v-else>
    <UserListDynamic
      :userListData="followerList"
      :isLoading="isLoading"
      :atBottom="nextPage < 0"
      :refetch="fetchFollowedUser"
      type="followed"
    />
  </template>
</template>