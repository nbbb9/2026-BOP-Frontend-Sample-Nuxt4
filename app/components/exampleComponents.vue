<script setup lang="ts">
import { createColumnHelper } from '@tanstack/vue-table';
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';

import {
  linkMenu, locationTree, corpOptions, bopTypeOptions,
  statusCardsData, productsData
} from '~/utils/mockData';
import TableGrid from "~/components/common/TableGrid.vue";

export interface Product {
  id: number;
  bopType: string;
  basicModel: string;
  project: string;
  step: string;
  order: string;
  simHistory: string;
  verification: string;
  result: string;
  manager: string;
  finalDate: string;
}

const columnHelper = createColumnHelper<Product>();

const columns = [
  columnHelper.group({
    header: '분류 정보',
    columns: [
      columnHelper.accessor('bopType', { header: 'BOP Type' }),
      columnHelper.accessor('basicModel', { header: 'Basic 모델' }),
    ]
  }),
  columnHelper.group({
    header: '프로젝트 상세',
    columns: [
      columnHelper.accessor('project', { header: '프로젝트' }),
      columnHelper.accessor('step', { header: '개발단계' }),
      columnHelper.accessor('order', { header: '차수' }),
    ]
  }),
  columnHelper.group({
    header: '검증 현황',
    columns: [
      columnHelper.accessor('simHistory', { header: '시뮬레이션 이력' }),
      columnHelper.accessor('verification', { header: 'Data Verification' }),
      columnHelper.accessor('result', { header: 'Result' }),
    ]
  }),
  columnHelper.group({
    header: '관리 정보',
    columns: [
      columnHelper.accessor('manager', { header: '설계 담당자' }),
      columnHelper.accessor('finalDate', { header: '최종 Sim. 일자' }),
    ]
  })
];

// 날짜 포맷터 설정 (한국어 표기)
const df = new DateFormatter('ko-KR', { dateStyle: 'medium' });

// 오늘 날짜 기준 초기화
const today = new Date();
const initDate = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate());

// shallowRef를 사용하여 클래스 인스턴스 유지
const dateRange = shallowRef({
  start: initDate,
  end: initDate.add({ days: 7 }) // 1주일 뒤
});

// 사이드바 메뉴 데이터
const sidebarMenu = ref(linkMenu);
// 사이드바 입력 검색어
const sidebarSearchInput = ref('');
// 사이드바 Tree 데이터
const sidebarTree = ref(locationTree);
// 사이드바 Tree 접기/펼치기 Toggle 메서드
const toggleExpand = (node: any) => {
  node.expanded = !node.expanded;
};
// 검색 필터값(초기 상태 설정)
const searchFilters = ref({
  // 'GUMI' -> corpOptions[0] (구미 객체)
  corp: corpOptions[0], // 'GUMI'
  bopType: bopTypeOptions[0] // 'dev'
});
// KPI 카드 색상 매핑 (utils에서 가져온 Raw 데이터에 UI 속성 추가)
// statusCardsData는 utils/mockData.ts에서 자동으로 불러옴
const statusCards = ref(statusCardsData.map((card: any, index: number) => {
  let color: 'primary' | 'green' = 'primary';
  return { ...card, color };
}));

const products = ref(productsData);

// 조회 버튼을 클릭하였을 때 로직
const onSearch = () => {
  console.log('조회 로직 수행');
  // API 호출 후 products.value 갱신 로 직추가
};

const goToGraph = () => {
  navigateTo('/chartExPage');
};
</script>

<template>
  <UApp>
    <div class="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <!--사이드바 영역-->
      <aside class="w-72 shrink-0 border-r border-gray-200 bg-white flex flex-col transition-all duration-300">
        <div class="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
          <div class="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <UIcon name="i-heroicons-chart-pie" class="w-7 h-7" />
            <span>Simul_Admin</span>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <div class="p-4">
            <UNavigationMenu
                orientation="vertical"
                :items="sidebarMenu"
                class="w-full"
                :ui="{
                  link: 'px-3 py-2' // v2와 비슷한 패딩감을 위해 추가 가능
                }"
            />
          </div>
          <USeparator class="my-2" />
          <div class="p-4">
            <div class="mb-6">
              <h3 class="text-sm font-bold text-gray-800 mb-2 block">검색</h3>
              <UInput
                  v-model="sidebarSearchInput"
                  icon="i-heroicons-magnifying-glass"
                  placeholder="검색어 입력..."
                  class="w-full"
                  variant="outline"
                  color="neutral"
                  :ui="{ root: 'bg-gray-50' }"
              />
            </div>
            <div>
              <label class="text-sm font-bold text-gray-800 mb-2 block">Location Tree</label>
              <div class="border border-gray-200 rounded-lg p-2 bg-white min-h-75">
                <ul class="space-y-1">
                  <li v-for="node in sidebarTree" :key="node.id">
                    <div class="flex items-center gap-2 py-1 hover:bg-gray-50 rounded px-1 group">
                      <button @click="toggleExpand(node)" class="text-gray-400 hover:text-gray-700 focus:outline-none">
                        <UIcon :name="node.expanded ? 'i-heroicons-caret-down-20-solid' : 'i-heroicons-caret-right-20-solid'" class="w-4 h-4" />
                      </button>
                      <UCheckbox v-model="node.checked" color="primary" />
                      <span class="text-sm text-gray-700 font-medium cursor-pointer" @click="toggleExpand(node)">{{ node.label }}</span>
                    </div>
                    <ul v-if="node.expanded" class="pl-8 mt-1 space-y-1 border-l border-gray-100 ml-2.5">
                      <li v-for="child in node.children" :key="child.id" class="flex items-center gap-2 py-1 hover:bg-gray-50 rounded px-1">
                        <UCheckbox v-model="child.checked" color="primary" />
                        <span class="text-sm text-gray-600 truncate">{{ child.label }}</span>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition">
            <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="User" size="sm" />
            <div class="text-sm"><p class="font-medium text-gray-900">Developer</p><p class="text-xs text-gray-500">dev@samsung.com</p></div>
          </div>
        </div>
      </aside>
      <!--메인 화면 영역-->
      <main class="flex-1 flex flex-col overflow-y-auto relative">
        <div class="p-8">
          <div class="max-w-7xl mx-auto">
            <div class="flex justify-between items-center mb-6">
              <h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
                공정 설계 최적화 Simulator <UBadge label="Beta" color="primary" variant="subtle" size="xs" />
              </h1>
              <UButton
                  label="그래프 보기"
                  icon="i-heroicons-chart-bar"
                  color="primary"
                  variant="soft"
                  size="md"
                  @click="goToGraph"
              />
            </div>
            <div class="flex flex-wrap items-end gap-3 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">법인</label>
                <USelectMenu v-model="searchFilters.corp" :items="corpOptions" option-attribute="label" value-attribute="value" class="w-32" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">BOP 유형</label>
                <USelectMenu v-model="searchFilters.bopType" :items="bopTypeOptions" option-attribute="label" value-attribute="value" class="w-32" />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">기간</label>

                <UPopover>
                  <UButton icon="i-heroicons-calendar-days" color="neutral" variant="outline" class="w-64 justify-start">
                    <template v-if="dateRange.start">
                      <template v-if="dateRange.end">
                        {{ df.format(dateRange.start.toDate(getLocalTimeZone())) }} - {{ df.format(dateRange.end.toDate(getLocalTimeZone())) }}
                      </template>
                      <template v-else>
                        {{ df.format(dateRange.start.toDate(getLocalTimeZone())) }}
                      </template>
                    </template>
                    <template v-else>
                      기간 선택
                    </template>
                  </UButton>

                  <template #content>
                    <UCalendar v-model="dateRange" class="p-2" :number-of-months="2" range />
                  </template>
                </UPopover>

              </div>
              <div class="flex-1"></div>
              <UButton label="조회" icon="i-heroicons-magnifying-glass" color="primary" variant="solid" @click="onSearch" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div v-for="(card, idx) in statusCards" :key="idx" class="bg-white rounded-xl p-5 border shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div class="flex justify-between items-start mb-4">
                  <div><p class="text-sm font-medium text-gray-500">{{ card.title }}</p><h3 class="text-2xl font-bold text-slate-900 mt-1">{{ card.label }}</h3></div>
                  <div :class="`p-2 rounded-lg bg-${card.color}-50 text-${card.color}-600`"><UIcon name="i-heroicons-chart-bar" class="w-5 h-5" /></div>
                </div>
                <UProgress v-model="card.value" status :color="card.color" size="sm" />
              </div>
            </div>

            <TableGrid :data="products" :columns="columns" />

          </div>
        </div>
      </main>
    </div>
  </UApp>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
</style>