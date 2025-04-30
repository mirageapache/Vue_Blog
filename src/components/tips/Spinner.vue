<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

library.add(faSpinner);
</script>

<template>
  <div class="flex justify-center items-center text-2xl md:text-3xl w-full mt-20">
    <font-awesome-icon
      :icon="['fas', 'spinner']"
      class="animate-spin h-7 w-7 m-1.5 mr-3"
    />
    載入中
  </div>
</template>
