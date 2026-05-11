<template>
  <div class="data-grid-container">
    <div class="grid-header">
      <slot name="header">
        <!-- Custom Header Slot -->
      </slot>
      <div class="bs-container-head__right">
        <!-- Excel Download -->
        <v-btn class="bs-btn" icon="mdi-file-excel" size="small" />
        <!-- Column select -->
        <!-- TODO v-select의 class 수정 필요 -->
        <v-select
            class="bs-text-field bs-combobox ml-2"
            v-model="selectedColumnIds"
            :items="selectableColumns"
            item-title="label"
            item-value="id"
            multiple
            placeholder="Column"
            density="compact"
            hide-details
            style="max-width: 250px;"
        >
          <template v-slot:prepend-item>
            <v-list-item title="Select All" @click="toggleAllColumns">
              <template v-slot:prepend>
                <v-checkbox-btn
                    :model-value="isAllColumnsSelected"
                    :indeterminate="isSomeColumnsSelected"
                />
              </template>
            </v-list-item>
          </template>
          <template #item="{ props, item }">
            <v-list-item v-bind="props" :title="item.label">
              <template #prepend="{ isSelected }">
                <v-checkbox-btn :model-value="isSelected"/>
              </template>
            </v-list-item>
          </template>
          <template #selection="{ item, index }">
            <span v-if="index === 0">{{ item.label }}</span>
            <span v-if="index === 1" class="text-grey text-caption ml-1">
              (+{{ selectedColumnIds.length - 1 }}개)
            </span>
          </template>
        </v-select>
      </div>
    </div>
    <v-table class="elevation-1" fixedHeader>
      <thead>
      <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :colspan="header.colSpan"
            class="header-cell"
            :style="header.column.id === 'select' ? { width: '48px' } : {}"
            @click="header.column.getToggleSortingHandler()?.($event)"
        >
          <div
              class="d-flex align-center font-weight-bold"
              :class="{ 'cursor-pointer': header.column.getCanSort() }"
          >
            <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
            />
            <span v-if="header.column.getCanSort()" class="sort-icon ml-1">
                {{ header.column.getIsSorted() === 'asc' ? '🔼' : '' }}
                {{ header.column.getIsSorted() === 'desc' ? '🔽' : '' }}
              </span>
          </div>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          :class="[props.rowStyleClass ? props.rowStyleClass(row.original) : '', 'hover-row']"
      >
        <td
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            :class="[
              props.rowStyleClass ? props.rowStyleClass(row.original) : '',
              props.cellStyleClass ? props.cellStyleClass(cell.getContext()) : '',
            ]"
        >
          <FlexRender
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
          />
        </td>
      </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts" generic="TData">
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  FlexRender,
} from '@tanstack/vue-table';
import type {
  ColumnDef,
  SortingState,
  CellContext,
  RowSelectionState,
  VisibilityState
} from '@tanstack/vue-table';
import { VCheckbox, VSelect, VListItem, VCheckboxBtn } from 'vuetify/components';

const props = defineProps<{
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  modelValue?: TData[];
  showSelect?: boolean;
  rowStyleClass?: (row: TData) => string;
  cellStyleClass?: (context: CellContext<TData, unknown>) => string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: TData[]];
}>();

// 정렬 상태 관리
const sorting = ref<SortingState>([]);
const rowSelection = ref<RowSelectionState>({});
const columnVisibility = ref<VisibilityState>({}); // TanStack Table 가시성 제어 상태

interface ColumnOption {
  id: string;
  label: string;
}

// 컬럼 목록 추출 (재귀를 통해 그룹 하위의 실제 컬럼만 추출)
const selectableColumns = computed<ColumnOption[]>(() => {
  const options: ColumnOption[] = [];

  const extractColumns = (cols: ColumnDef<TData, unknown>[]) => {
    cols.forEach(col => {
      // 그룹 컬럼인 경우 (하위 columns 배열이 존재함)
      if ('columns' in col && Array.isArray(col.columns)) {
        extractColumns(col.columns as ColumnDef<TData, unknown>[]);
      } else {
        // 실제 데이터를 렌더링하는 Leaf(종단) 컬럼인 경우 accessorKey나 id를 추출하고, header가 문자열이면 라벨로 사용
        const id = (col as any).id || (col as any).accessorKey;
        if (id && id !== 'select') {
          const label = typeof col.header === 'string' ? col.header : id;
          options.push({ id, label });
        }
      }
    });
  };

  extractColumns(props.columns);
  return options;
});

// 표시를 선택한 컬럼 아이디
const selectedColumnIds = ref<string[]>(selectableColumns.value.map(col => col.id));

// 전체 선택 상태 여부
const isAllColumnsSelected = computed(() => {
  return (
      selectableColumns.value.length > 0 &&
      selectedColumnIds.value.length === selectableColumns.value.length
  );
});

// 부분 선택 상태 계산 (일부만 선택되었는가? -> indeterminate 표현용)
const isSomeColumnsSelected = computed(() => {
  return selectedColumnIds.value.length > 0 && !isAllColumnsSelected.value;
});

// 전체 선택 / 해제 토글 로직
const toggleAllColumns = () => {
  if (isAllColumnsSelected.value) { // 모두 선택된 상태라면 -> 전체 해제 (빈 배열)
    selectedColumnIds.value = [];
  } else { // 일부만 선택되었거나 모두 해제된 상태라면 -> 전체 선택 (모든 ID 배열)
    selectedColumnIds.value = selectableColumns.value.map(col => col.id);
  }
};

// 사용자가 드롭다운에서 선택을 변경할 때마다 TanStack Visibility 상태 동기화
watch(selectedColumnIds, (newSelectedIds) => {
  const visibility: VisibilityState = {};
  selectableColumns.value.forEach(col => {
    // 선택된 ID 배열에 포함되어 있으면 true(보임), 아니면 false(숨김)
    visibility[col.id] = newSelectedIds.includes(col.id);
  });
  columnVisibility.value = visibility;
}, { deep: true, immediate: true });


const finalColumns = computed<ColumnDef<TData, unknown>[]>(() => {
  const baseColumns = [...props.columns];

  if (props.showSelect) {
    const selectColumn: ColumnDef<TData, unknown> = {
      id: 'select',
      header: ({ table }) =>
          h(VCheckbox as Component, {
            modelValue: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected(),
            'onUpdate:modelValue': (val: boolean) => table.toggleAllRowsSelected(!!val),
            density: 'compact',
            hideDetails: true,
            class: 'bs-checkbox',
          }),
      cell: ({ row }) =>
          h(VCheckbox as Component, {
            modelValue: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            'onUpdate:modelValue': (val: boolean) => row.toggleSelected(!!val),
            density: 'compact',
            hideDetails: true,
            class: 'bs-checkbox',
          }),
    };
    return [selectColumn, ...baseColumns];
  }

  return baseColumns;
});

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return finalColumns.value;
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
  },
  enableRowSelection: true,
  onSortingChange: updater => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater;
  },
  onRowSelectionChange: updater => {
    rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater;
  },
  onColumnVisibilityChange: updater => {
    columnVisibility.value = typeof updater === 'function' ? updater(columnVisibility.value) : updater;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
});

watch(rowSelection, () => {
  const selectedData = table.getSelectedRowModel().flatRows.map(row => row.original);
  emit('update:modelValue', selectedData);
}, { deep: true });

watch(() => props.modelValue, (newVal) => {
  if (!newVal || newVal.length === 0) {
    rowSelection.value = {};
  }
}, { deep: true });
</script>

<style scoped>
.data-grid-container {
  width: 100%;
}

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.hover-row:hover {
  background-color: #f1f5f9;
}

.cursor-pointer {
  cursor: pointer;
  user-select: none;
}
</style>
