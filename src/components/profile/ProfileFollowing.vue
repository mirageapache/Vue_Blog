<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { isEmpty } from 'lodash';
import NoSearchResult from '../tips/NoSearchResult.vue';
import UserListDynamic from '../user/userListDynamic.vue';
import type { UserDataType } from '@/types/userType';
import { getFollowingList } from '@/api/follow';

const props = defineProps<{
  userId: string;
  identify: boolean;
}>();

const { userId, identify } = props;
const isLoading = ref(false);
const followingList = ref<UserDataType[]>([]);
const nextPage = ref(1);

const fetchFollowingUser = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await getFollowingList(userId, nextPage.value);
    if (res) {
      followingList.value.push(...res.followList);
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
    if (nextPage.value > 0) fetchFollowingUser();
  }
};

onMounted(() => {
  fetchFollowingUser();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <template v-if="isEmpty(followingList) && !isLoading">
    <NoSearchResult
      v-if="identify"
      msgOne="你還沒有追蹤任何人喔"
      msgTwo="快去尋找有趣的人吧"
      type="user"
    />
    <NoSearchResult
      v-else
      msgOne="沒有追蹤任何人"
      msgTwo=""
      type="user"
    />
  </template>
  <template v-else>
    <UserListDynamic
      :userListData="followingList"
      :isLoading="isLoading"
      :atBottom="nextPage < 0"
      :refetch="fetchFollowingUser"
      type="userList"
    />
  </template>
</template>