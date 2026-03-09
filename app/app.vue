<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">

// 컬러 모드 훅 가져오기 (Nuxt UI 자동 임포트)
const colorMode = useColorMode()

// 시스템 설정을 무시하고 'light/dark' 모드로 강제 고정
colorMode.preference = 'light'
</script>