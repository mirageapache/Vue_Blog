<script setup lang="ts">
import type { UserDataType } from '@/types/userType';
import UserInfoPanel from './UserInfoPanel.vue';
import UserListLoading from './UserListLoading.vue';
import UserLoading from '@/components/user/UserLoading.vue';
import FollowingItem from './FollowingItem.vue';

const props = defineProps<{
  userListData: UserDataType[];
  isLoading: boolean;
  atBottom: boolean;
  type: string;
}>();

const { userListData, isLoading, atBottom, type } = props;

const emit = defineEmits<{
  (e: 'refetch'): void;
}>();

const refetch = () => {
  emit('refetch');
};

</script>

<template>
  <template v-if="isLoading">
    <UserListLoading />
  </template>
  <section class="w-full">
    <div v-if="type === 'followed'">
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
    <div v-if="type === 'userList'">
      <FollowingItem
        v-for="user in userListData"
        :key="user._id"
        :user="user"
        @refetch="refetch"
      />
    </div>
    <div v-if="atBottom" class="my-5 text-center text-gray-500">- 已經沒有更多資料了 -</div>
    <UserLoading v-else :withBorder="false" />
  </section>
</template>
