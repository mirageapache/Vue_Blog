<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { isEmpty } from 'lodash';
import { getSearchUserList } from '@/api/user';
import { getCookies } from '@/utils/common';
import type { UserDataType } from '@/types/userType';
import NoSearchResult from '../tips/NoSearchResult.vue';
import UserListLoading from '../user/UserListLoading.vue';
import UserListDynamic from '../user/userListDynamic.vue';

const nextPage = ref(1);
const isLoading = ref(false);
const userList = ref<UserDataType[]>([]);
const searchString = useRoute().query.searchString;
const currentUser = getCookies('uid');

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const res = await getSearchUserList(nextPage.value, searchString as string, currentUser);
    
    if (res) {
      userList.value.push(...res.data);
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
    if (nextPage.value > 0) fetchUsers();
  }
};

onMounted(() => {
  fetchUsers();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <template v-if="isEmpty(userList)">
    <NoSearchResult msgOne="搜尋不到相關文章" msgTwo="" type="article" />
  </template>
  <template v-else-if="isLoading">
    <UserListLoading />
  </template>
  <template v-else>
    <UserListDynamic
      :userListData="userList"
      :isLoading="isLoading"
      :atBottom="nextPage < 0"
      @refetch="fetchUsers"
      type="userList"
    />
  </template>
</template>
