<script setup lang="ts">
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler);

// 차트 옵션
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' as const } }
};

// 뒤로 가기 함수
const goBack = () => {
  navigateTo('/examplePage'); // 테이블 페이지로 이동(Nuxt3에서는 해당 코드와 같이 route.push가 아닌 mapsTo방식을 권장)
};
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden font-sans">
    <main class="flex-1 flex flex-col overflow-y-auto relative bg-gray-50">
      <div class="p-8">
        <div class="max-w-7xl mx-auto">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <UIcon name="i-heroicons-presentation-chart-line" />
              Simulation Dashboard
            </h1>
            <UButton
                label="메인으로 돌아가기"
                icon="i-heroicons-arrow-left"
                color="primary"
                variant="solid"
                @click="goBack"
            />
          </div>

          <div class="flex flex-col gap-6 animate-fade-in">

            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 class="text-lg font-bold text-gray-800 mb-4">월별 시뮬레이션 수행 추이</h3>
              <div class="h-80">
                <Line :data="monthlySimulationData" :options="chartOptions" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 class="text-lg font-bold text-gray-800 mb-4">프로젝트별 성공률</h3>
                <div class="h-64">
                  <Bar :data="projectStatusData" :options="chartOptions" />
                </div>
              </div>

              <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 class="text-lg font-bold text-gray-800 mb-4">주요 에러 유형 분포</h3>
                <div class="h-64 flex justify-center">
                  <Doughnut :data="errorDistributionData" :options="chartOptions" />
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 class="text-lg font-bold text-gray-800 mb-4">팀별 성과 지표 (KPI)</h3>
              <div class="h-80 flex justify-center">
                <Radar :data="teamPerformanceData" :options="chartOptions" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>