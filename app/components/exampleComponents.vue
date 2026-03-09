<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FlexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/vue-table';
// 날짜 관련 모듈 import
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';

const pagination = ref({
  pageIndex: 0,
  pageSize: 15, // 한 페이지당 15개
});

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

// TanStack Table 설정
// 타입 정의 (필요시 types/ 폴더로 분리하거나 여기에 유지)
interface Product {
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
  // 그룹 1: 분류 정보
  columnHelper.group({
    header: '분류 정보',
    columns: [
      columnHelper.accessor('bopType', { header: 'BOP Type' }),
      columnHelper.accessor('basicModel', { header: 'Basic 모델' }),
    ]
  }),
  // 그룹 2: 프로젝트 상세
  columnHelper.group({
    header: '프로젝트 상세',
    columns: [
      columnHelper.accessor('project', { header: '프로젝트' }),
      columnHelper.accessor('step', { header: '개발단계' }),
      columnHelper.accessor('order', { header: '차수' }),
    ]
  }),
  // 그룹 3: 검증 현황
  columnHelper.group({
    header: '검증 현황',
    columns: [
      columnHelper.accessor('simHistory', { header: '시뮬레이션 이력' }),
      columnHelper.accessor('verification', { header: 'Data Verification' }),
      columnHelper.accessor('result', { header: 'Result' }),
    ]
  }),
  // 그룹 4: 관리 정보
  columnHelper.group({
    header: '관리 정보',
    columns: [
      columnHelper.accessor('manager', { header: '설계 담당자' }),
      columnHelper.accessor('finalDate', { header: '최종 Sim. 일자' }),
    ]
  })
];

// 정렬 상태
const sorting = ref<SortingState>([
  { id: 'bopType', desc: false } // 행 병합을 위해 초기 정렬 설정
]);

// 선택한 행
const rowSelection = ref({});

// 테이블 가데이터
const products = ref(productsData);

// Vue의 반응형 데이터와 TanStack Table의 기능을 연결
const table = useVueTable({
  get data() { return products.value; }, // 데이터 연결
  columns, // 컬럼 정의 연결
  state: { // 테이블 상태
    get sorting() { return sorting.value; },
    get rowSelection() { return rowSelection.value; },
    get pagination() { return pagination.value; },
  },
  // 상태 변경 핸들러
  onSortingChange: updaterOrValue => { sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue },
  onRowSelectionChange: updaterOrValue => { rowSelection.value = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection.value) : updaterOrValue },
  // 파이프라인 : 테이블 데이터가 화면에 그려지기까지 거치는 처리 과정들을 설정한다.
  getCoreRowModel: getCoreRowModel(), // 기본 행 모델을 생성한다.
  getSortedRowModel: getSortedRowModel(), // 데이터 정렬 기능 활성화
  getPaginationRowModel: getPaginationRowModel(), // 페이지네이션 기능 활성화
  onPaginationChange: updaterOrValue => {
    pagination.value = typeof updaterOrValue === 'function'
        ? updaterOrValue(pagination.value)
        : updaterOrValue;
  },
  initialState: { pagination: { pageSize: 15 } }, // 테이블이 처음 로드될 때의 기본 상태
});

// 행 병합(Row Span) 계산 함수
// 현재 행(rowId)의 특정 컬럼(columnId) 값이 이전 행과 같으면 0(숨김), 다르면 연속된 개수(rowspan) 반환
const getRowSpan = (rowId: string, columnId: string) => {
  const rows = table.getSortedRowModel().rows; // 현재 정렬된 데이터 기준
  const index = rows.findIndex(r => r.id === rowId);

  if (index === -1) return 1;

  // 1. 이전 행과 값이 같으면 숨김 (return 0)
  if (index > 0) {
    const prevValue = rows[index - 1].getValue(columnId);
    const currentValue = rows[index].getValue(columnId);
    if (prevValue === currentValue) return 0;
  }

  // 2. 이후 행들과 비교하여 병합할 개수 계산
  let span = 1;
  for (let i = index + 1; i < rows.length; i++) {
    const currentValue = rows[index].getValue(columnId);
    const nextValue = rows[i].getValue(columnId);
    if (currentValue === nextValue) {
      span++;
    } else {
      break;
    }
  }
  return span;
};

// 조회 버튼을 클릭하였을 때 로직
const onSearch = () => {
  console.log('조회 필터:', {
    corp: searchFilters.value.corp.value,       // 객체에서 value 추출
    bopType: searchFilters.value.bopType.value, // 객체에서 value 추출
    dates: {
      start: dateRange.value.start.toString(),
      end: dateRange.value.end.toString()
    }
  });
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
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2"><UIcon name="i-heroicons-list-bullet" />공정 설계 현황 List</h2>
                <div class="flex gap-2"><UButton label="Simulation" icon="i-heroicons-play" color="primary" variant="solid" size="xs" /></div>
              </div>
              <div class="overflow-auto h-125">
                <table class="w-full text-sm text-left border-collapse">
                  <thead class="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                    <th v-for="header in headerGroup.headers" :key="header.id"
                        :colSpan="header.colSpan"
                        class="px-4 py-3 font-semibold text-center whitespace-nowrap border-b border-r border-gray-200 last:border-r-0"
                        :class="{'cursor-pointer hover:bg-gray-100': !header.isPlaceholder}"
                        @click="!header.isPlaceholder ? header.column.getToggleSortingHandler()?.($event) : null">
                      <div v-if="!header.isPlaceholder" class="flex items-center justify-center gap-1 group">
                        <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                        <UIcon v-if="header.column.getIsSorted() === 'asc'" name="i-heroicons-bars-arrow-up-20-solid" class="text-primary-600" />
                        <UIcon v-else-if="header.column.getIsSorted() === 'desc'" name="i-heroicons-bars-arrow-down-20-solid" class="text-primary-600" />
                      </div>
                    </th>
                  </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                  <tr v-for="(row, i) in table.getRowModel().rows" :key="row.id" class="bg-white hover:bg-gray-50/80 transition-colors">
                    <template v-for="cell in row.getVisibleCells()" :key="cell.id">
                      <td
                          v-if="cell.column.id !== 'bopType' || getRowSpan(row.id, 'bopType') > 0"
                          :rowspan="cell.column.id === 'bopType' ? getRowSpan(row.id, 'bopType') : 1"
                          class="px-4 py-3 text-center whitespace-nowrap border-r border-gray-100 last:border-r-0"
                          :class="{'align-middle bg-white border-b border-gray-100': cell.column.id === 'bopType' && getRowSpan(row.id, 'bopType') > 1}"
                      >
                        <template v-if="cell.column.id === 'bopType'">
                          {{ cell.getValue() === 'dev' ? '개발' : (cell.getValue() === 'mass' ? '양산' : cell.getValue()) }}
                        </template>
                        <template v-else-if="cell.column.id === 'simHistory'">
                          <div v-if="cell.getValue() === 'none'" class="text-gray-300">-</div>
                          <USelectMenu
                              v-else
                              v-model="row.original.simHistory as any"
                              :items="simHistoryOptions"
                              option-attribute="label"
                              value-attribute="value"
                              size="xs"
                              class="w-32 mx-auto"
                          />
                        </template>
                        <template v-else-if="cell.column.id === 'verification'">
                          <div v-if="cell.getValue() === 'none'" class="text-gray-300">-</div>
                          <UButton
                              v-else-if="cell.getValue() === 'ready'"
                              label="Ready"
                              color="primary"
                              variant="soft"
                              size="xs"
                              class="w-16 justify-center"
                          />
                          <UBadge v-else label="Done" color="primary" variant="subtle" size="xs" />
                        </template>
                        <template v-else-if="cell.column.id === 'result'">
                          <div v-if="cell.getValue() === 'none'" class="text-gray-300">-</div>
                          <UBadge
                              v-else-if="cell.getValue() === 'complete'"
                              label="Complete"
                              color="primary"
                              variant="solid"
                              class="w-20 justify-center"
                          />
                          <UBadge
                              v-else-if="cell.getValue() === 'processing'"
                              label="Processing"
                              color="primary"
                              variant="solid"
                              class="w-20 justify-center"
                          />
                          <span v-else class="text-gray-300 text-xs">Waiting</span>
                        </template>
                        <template v-else>
                          <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                        </template>
                      </td>
                    </template>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <UPagination
                    :page="table.getState().pagination.pageIndex + 1"
                    :total="table.getFilteredRowModel().rows.length"
                    :items-per-page="table.getState().pagination.pageSize"
                    @update:page="(val) => table.setPageIndex(val - 1)"
                    :ui="{ item: 'rounded-full' }"
                />
              </div>
            </div>
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