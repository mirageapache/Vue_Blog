<script setup lang="ts">
import type { CommentDataType } from '@/types/commentType';
import { get } from 'lodash';
import Avatar from '../user/Avatar.vue';
import { formatDateTime } from '@/utils/dateTime';

const props = defineProps<{
  commentData: CommentDataType;
}>();

const { commentData } = props;
const { name, avatar, bgColor, _id } = get(commentData, 'author');
</script>

<template>
  <div class="mb-4">
    <div class="flex">
      <div class="mr-2">
        <Avatar
          :name="name"
          :avatarUrl="avatar"
          :size="'w-11 h-11'"
          :textSize="'text-xl'"
          :bgColor="bgColor"
        />
      </div>
      <div>
        <span class="flex gap-2">
          <router-link :to="`/user/profile/${_id}`" class="hover:text-orange-500 cursor-pointer">
            <p class="text-lg">{{ name }}</p>
          </router-link>
          <p class="text-gray-500">{{ formatDateTime(commentData.createdAt) }}</p>
        </span>
        <div v-html="commentData.content" />
      </div>
    </div>
  </div>
</template>
