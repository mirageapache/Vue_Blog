<script setup lang="ts">
import type { UserDataType } from '@/types/userType';
import UserInfoPanel from './UserInfoPanel.vue';
import UserListLoading from './UserListLoading.vue';
import UserLoading from '@/components/user/UserLoading.vue';
import FollowingItem from './FollowingItem.vue';
import { ref, watch } from 'vue';

const props = defineProps<{
  userListData: UserDataType[];
  isLoading: boolean;
  atBottom: boolean;
  type: string;
}>();

const emit = defineEmits<{
  (e: 'refetch'): void;
}>();

const refetch = () => {
  emit('refetch');
};

const localAtBottom = ref(props.atBottom);

watch(() => props.atBottom,
  (newValue) => {
    localAtBottom.value = newValue;
  },
  { immediate: true }
);
</script>

<template>
  <template v-if="userListData.length === 0 && isLoading">
    <UserListLoading />
  </template>
  <template v-else>
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
      <div v-else>
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
</template>
