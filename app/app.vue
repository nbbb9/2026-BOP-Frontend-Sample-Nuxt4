<template>
  <v-app>
    <NuxtPage />
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

const theme = useTheme(); // Vuetify 테마 객체 가져오기

theme.global.name.value = 'light'; // 'light' 모드로 강제 지정
</script>