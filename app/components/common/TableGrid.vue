<script setup lang="ts">
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FlexRender,
  createColumnHelper,
  type SortingState, type ColumnDef,
} from '@tanstack/vue-table';
import { simHistoryOptions } from '~/utils/mockData';
import type {TableColumn} from "@nuxt/ui/components/Table.vue";

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

const props = defineProps<{
  data: any[];
  columns: ColumnDef<any, any>[];
}>();

const pagination = ref({
  pageIndex: 0,
  pageSize: 15,
});

const sorting = ref<SortingState>([{ id: 'bopType', desc: false }]);
const rowSelection = ref({});

// 4. 테이블 인스턴스 생성
const table = useVueTable({
  get data() { return props.data; }, // 부모가 준 Props 데이터를 연결
  get columns () { return props.columns; },
  state: {
    get sorting() { return sorting.value; },
    get rowSelection() { return rowSelection.value; },
    get pagination() { return pagination.value; },
  },
  onSortingChange: updaterOrValue => { sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue },
  onRowSelectionChange: updaterOrValue => { rowSelection.value = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection.value) : updaterOrValue },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  onPaginationChange: updaterOrValue => {
    pagination.value = typeof updaterOrValue === 'function' ? updaterOrValue(pagination.value) : updaterOrValue;
  },
  initialState: { pagination: { pageSize: 15 } },
});

// 5. 행 병합 로직
const getRowSpan = (rowId: string, columnId: string) => {
  const rows = table.getSortedRowModel().rows;
  const index = rows.findIndex(r => r.id === rowId);

  if (index === -1) return 1;

  if (index > 0) {
    const prevValue = rows[index - 1].getValue(columnId);
    const currentValue = rows[index].getValue(columnId);
    if (prevValue === currentValue) return 0;
  }

  let span = 1;
  for (let i = index + 1; i < rows.length; i++) {
    const currentValue = rows[index].getValue(columnId);
    const nextValue = rows[i].getValue(columnId);
    if (currentValue === nextValue) span++;
    else break;
  }
  return span;
};
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
      <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
        <UIcon name="i-heroicons-list-bullet" />공정 설계 현황 List
      </h2>
      <div class="flex gap-2">
        <UButton label="Simulation" icon="i-heroicons-play" color="primary" variant="solid" size="xs" />
      </div>
    </div>

    <div class="overflow-auto h-125">
      <table class="w-full text-sm text-left border-collapse">
        <thead class="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <th v-for="header in headerGroup.headers" :key="header.id" :colSpan="header.colSpan" class="px-4 py-3 font-semibold text-center whitespace-nowrap border-b border-r border-gray-200 last:border-r-0" :class="{'cursor-pointer hover:bg-gray-100': !header.isPlaceholder}" @click="!header.isPlaceholder ? header.column.getToggleSortingHandler()?.($event) : null">
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
            <td v-if="cell.column.id !== 'bopType' || getRowSpan(row.id, 'bopType') > 0" :rowspan="cell.column.id === 'bopType' ? getRowSpan(row.id, 'bopType') : 1" class="px-4 py-3 text-center whitespace-nowrap border-r border-gray-100 last:border-r-0" :class="{'align-middle bg-white border-b border-gray-100': cell.column.id === 'bopType' && getRowSpan(row.id, 'bopType') > 1}">
              <template v-if="cell.column.id === 'bopType'">
                {{ cell.getValue() === 'dev' ? '개발' : (cell.getValue() === 'mass' ? '양산' : cell.getValue()) }}
              </template>
              <template v-else-if="cell.column.id === 'simHistory'">
                <div v-if="cell.getValue() === 'none'" class="text-gray-300">-</div>
                <USelectMenu v-else v-model="row.original.simHistory as any" :items="simHistoryOptions" option-attribute="label" value-attribute="value" size="xs" class="w-32 mx-auto" />
              </template>
              <template v-else-if="cell.column.id === 'verification'">
                <div v-if="cell.getValue() === 'none'" class="text-gray-300">-</div>
                <UButton v-else-if="cell.getValue() === 'ready'" label="Ready" color="primary" variant="soft" size="xs" class="w-16 justify-center" />
                <UBadge v-else label="Done" color="primary" variant="subtle" size="xs" />
              </template>
              <template v-else-if="cell.column.id === 'result'">
                <div v-if="cell.getValue() === 'none'" class="text-gray-300">-</div>
                <UBadge v-else-if="cell.getValue() === 'complete'" label="Complete" color="primary" variant="solid" class="w-20 justify-center" />
                <UBadge v-else-if="cell.getValue() === 'processing'" label="Processing" color="primary" variant="solid" class="w-20 justify-center" />
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
</template>