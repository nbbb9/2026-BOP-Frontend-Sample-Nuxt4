<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-4">
    <div>UI Framework</div>
    <UButton label="예시 페이지로 이동" color="primary" variant="solid" @click="navigateToExamplePage" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToExamplePage = () => {
  router.push('/examplePage');
};
</script>