<script setup lang="ts">
import type { UserDataType } from '@/types/userType';
import UserInfoPanel from './UserInfoPanel.vue';
import UserListLoading from './UserListLoading.vue';
import UserLoading from '@/components/user/UserLoading.vue';

const props = defineProps<{
  userListData: UserDataType[];
  isLoading: boolean;
  atBottom: boolean;
}>();

const { userListData, isLoading, atBottom } = props;

</script>

<template>
  <template v-if="isLoading">
    <UserListLoading />
  </template>
  <section class="w-full">
    <div>
      <UserInfoPanel
        v-for="user in userListData"
        :key="user._id"
        :userId="user._id"
        :account="user.account"
        :name="user.name"
        :avatarUrl="user.avatar"
        :bgColor="user.bgColor"
        className="my-2"
      />
    </div>
    <div v-if="atBottom" class="my-5 text-center text-gray-500">- 已經沒有更多資料了 -</div>
    <UserLoading v-else :withBorder="false" />
  </section>
</template>
