// Option 인터페이스 정의 (공통 사용)
export interface Option {
    label: string;
    value: string;
    title?: string; // Vuetify용
}

// 사이드바 메뉴 데이터
export const linkMenu = [
    { label: 'Dashboard', icon: 'i-heroicons-home', to: '/dashboard' },
    { label: 'Simulator', icon: 'i-heroicons-cpu-chip', to: '/simulator', active: true },
    { label: 'Data Management', icon: 'i-heroicons-circle-stack', to: '/data' },
];

// 사이드바 Tree 데이터
export const locationTree = [
    {
        id: 'gumi',
        label: 'GUMI',
        expanded: true,
        checked: false,
        children: [
            { id: 'p103', label: '[SEC]Mobile Gumi - P103', checked: true },
            { id: 'bonde', label: '[SEC]Mobile Gumi-Bonde', checked: true },
        ]
    },
    {
        id: 'suwon',
        label: 'SUWON',
        expanded: true,
        checked: false,
        children: [
            { id: 'c01', label: '[SEC]Computer Suwon - C01', checked: true },
        ]
    }
];

// 법인 옵션
export const corpOptions: Option[] = [
    { label: '구미', value: 'GUMI', title: '구미' },
    { label: '서울', value: 'SEOUL', title: '서울' }
];

// BOP 타입 옵션
export const bopTypeOptions: Option[] = [
    { label: '개발', value: 'dev', title: '개발' },
    { label: '설계', value: 'design', title: '설계' },
    { label: 'Master', value: 'master', title: 'Master' },
    { label: '양산', value: 'mass', title: '양산' }
];

// BOP 개발 차수
export const bopDevDegr: Option[] = [
    { label: 'DV1', value: 'DV1', title: 'DV1' },
    { label: 'DV2', value: 'DV2', title: 'DV2' },
    { label: 'DV최종', value: 'DVFin', title: 'DV최종' },
    { label: 'PV1', value: 'PV1', title: 'PV1' },
    { label: 'PV최종', value: 'PVFin', title: 'PV최종' }
];

// 시뮬레이션 이력 옵션
export const simHistoryOptions: Option[] = [
    { label: 'No History', value: 'none', title: 'No History' },
    { label: '자주검증 2', value: 'self_2', title: '자주검증 2' },
    { label: 'DV 최종', value: 'dv_final', title: 'DV 최종' },
    { label: 'PV 최종', value: 'pv_final', title: 'PV 최종' }
];

// KPI 현황 데이터 (각 프레임워크별 색상 처리가 달라 기본 데이터만 제공하거나, 필요한 속성을 모두 포함)
export const statusCardsData = [
    { title: '자주검증', label: '10 / 100 완료', value: 10 },
    { title: 'DV 단계', label: '30 / 90 완료', value: 33 },
    { title: 'PV 단계', label: '20 / 40 완료', value: 50 },
];

// 테이블 데이터
export const productsData = [
    { id: 1, bopType: '개발', basicModel: 'SM-S948', project: 'N.PA3', step: '자주검증', order: '1', simHistory: 'none', verification: 'none', result: 'none', manager: '김철수', finalDate: '2025-12-10' },
    { id: 2, bopType: '개발', basicModel: 'SM-A176', project: 'A17 5G', step: 'PV', order: '최종', simHistory: 'pv_final', verification: 'ready', result: 'complete', manager: '이영희', finalDate: '2025-12-11' },
    { id: 3, bopType: '개발', basicModel: 'SM-S947', project: 'N.PA2', step: '자주검증', order: '2', simHistory: 'self_2', verification: 'ready', result: 'none', manager: '박지민', finalDate: '2025-12-12' },
    { id: 4, bopType: '개발', basicModel: 'SM-F968', project: 'Q7M', step: 'DV', order: '최종', simHistory: 'dv_final', verification: 'ready', result: 'complete', manager: '최준호', finalDate: '2025-12-13' },
    { id: 5, bopType: '개발', basicModel: 'SM-X626', project: 'TAB S10', step: 'DV', order: '2', simHistory: 'dv_final', verification: 'ready', result: 'processing', manager: '정우성', finalDate: '2025-12-14' },
    { id: 6, bopType: '설계', basicModel: 'SM-G991', project: 'O2 5G', step: 'DV', order: '1', simHistory: 'none', verification: 'none', result: 'none', manager: '강동원', finalDate: '2025-12-15' },
    { id: 7, bopType: '양산', basicModel: 'SM-M325', project: 'M32', step: 'PV', order: '최종', simHistory: 'pv_final', verification: 'ready', result: 'complete', manager: '한지민', finalDate: '2025-12-16' },
    { id: 8, bopType: '개발', basicModel: 'SM-A528', project: 'A52s', step: '자주검증', order: '1', simHistory: 'self_2', verification: 'ready', result: 'none', manager: '송중기', finalDate: '2025-12-17' },
    { id: 9, bopType: 'Master', basicModel: 'SM-Z900', project: 'Z Fold 6', step: 'DV', order: '2', simHistory: 'dv_final', verification: 'ready', result: 'complete', manager: '전지현', finalDate: '2025-12-18' },
    { id: 10, bopType: '개발', basicModel: 'SM-S911', project: 'S23', step: 'PV', order: '1', simHistory: 'none', verification: 'none', result: 'none', manager: '공유', finalDate: '2025-12-19' },
    { id: 11, bopType: '설계', basicModel: 'SM-A346', project: 'A34', step: '자주검증', order: '2', simHistory: 'self_2', verification: 'ready', result: 'none', manager: '아이유', finalDate: '2025-12-20' },
    { id: 12, bopType: '양산', basicModel: 'SM-F731', project: 'Z Flip 6', step: 'DV', order: '최종', simHistory: 'dv_final', verification: 'ready', result: 'complete', manager: '박서준', finalDate: '2025-12-21' },
    { id: 13, bopType: '개발', basicModel: 'SM-T870', project: 'Tab S7', step: 'PV', order: '최종', simHistory: 'pv_final', verification: 'ready', result: 'processing', manager: '김태리', finalDate: '2025-12-22' },
    { id: 14, bopType: 'Master', basicModel: 'SM-S928', project: 'S24 Ultra', step: '자주검증', order: '1', simHistory: 'none', verification: 'none', result: 'none', manager: '손흥민', finalDate: '2025-12-23' },
    { id: 15, bopType: '개발', basicModel: 'SM-A235', project: 'A23', step: 'DV', order: '2', simHistory: 'dv_final', verification: 'ready', result: 'complete', manager: '이강인', finalDate: '2025-12-24' },
    { id: 16, bopType: '설계', basicModel: 'SM-M127', project: 'M12', step: 'PV', order: '1', simHistory: 'none', verification: 'none', result: 'none', manager: '김민재', finalDate: '2025-12-25' },
    { id: 17, bopType: '양산', basicModel: 'SM-E426', project: 'F42', step: '자주검증', order: '2', simHistory: 'self_2', verification: 'ready', result: 'none', manager: '황희찬', finalDate: '2025-12-26' },
    { id: 18, bopType: '개발', basicModel: 'SM-S908', project: 'S22 Ultra', step: 'DV', order: '최종', simHistory: 'dv_final', verification: 'ready', result: 'complete', manager: '조규성', finalDate: '2025-12-27' },
    { id: 19, bopType: 'Master', basicModel: 'SM-X200', project: 'Tab A8', step: 'PV', order: '최종', simHistory: 'pv_final', verification: 'ready', result: 'complete', manager: '유재석', finalDate: '2025-12-28' },
    { id: 20, bopType: '개발', basicModel: 'SM-A047', project: 'A04s', step: '자주검증', order: '1', simHistory: 'none', verification: 'none', result: 'none', manager: '강호동', finalDate: '2025-12-29' },
    { id: 21, bopType: '설계', basicModel: 'SM-G781', project: 'S20 FE', step: 'DV', order: '2', simHistory: 'dv_final', verification: 'ready', result: 'processing', manager: '신동엽', finalDate: '2025-12-30' },
    { id: 22, bopType: '양산', basicModel: 'SM-N986', project: 'Note 20 Ultra', step: 'PV', order: '1', simHistory: 'none', verification: 'none', result: 'none', manager: '이수근', finalDate: '2025-12-31' },
    { id: 23, bopType: '개발', basicModel: 'SM-F936', project: 'Z Fold 4', step: '자주검증', order: '2', simHistory: 'self_2', verification: 'ready', result: 'none', manager: '은지원', finalDate: '2026-01-01' },
    { id: 24, bopType: 'Master', basicModel: 'SM-F721', project: 'Z Flip 4', step: 'DV', order: '최종', simHistory: 'dv_final', verification: 'ready', result: 'complete', manager: '송민호', finalDate: '2026-01-02' },
    { id: 25, bopType: '개발', basicModel: 'SM-S901', project: 'S22', step: 'PV', order: '최종', simHistory: 'pv_final', verification: 'ready', result: 'complete', manager: '피오', finalDate: '2026-01-03' },
    { id: 26, bopType: '설계', basicModel: 'SM-A556', project: 'A55', step: '자주검증', order: '1', simHistory: 'none', verification: 'none', result: 'none', manager: '김연아', finalDate: '2026-01-04' },
    { id: 27, bopType: '개발', basicModel: 'SM-S931', project: 'S25', step: 'DV', order: '2', simHistory: 'dv_final', verification: 'ready', result: 'processing', manager: '박태환', finalDate: '2026-01-05' },
    { id: 28, bopType: '양산', basicModel: 'SM-X710', project: 'Tab S9', step: 'PV', order: '최종', simHistory: 'pv_final', verification: 'ready', result: 'complete', manager: '장미란', finalDate: '2026-01-06' },
    { id: 29, bopType: 'Master', basicModel: 'SM-F946', project: 'Z Fold 5', step: '자주검증', order: '1', simHistory: 'self_2', verification: 'ready', result: 'none', manager: '이효리', finalDate: '2026-01-07' },
    { id: 30, bopType: '개발', basicModel: 'SM-M546', project: 'M54', step: 'DV', order: '2', simHistory: 'dv_final', verification: 'ready', result: 'processing', manager: '비', finalDate: '2026-01-08' },
    { id: 31, bopType: '설계', basicModel: 'SM-E526', project: 'F52', step: 'PV', order: '1', simHistory: 'none', verification: 'none', result: 'none', manager: '싸이', finalDate: '2026-01-09' },
    { id: 32, bopType: '개발', basicModel: 'SM-S918', project: 'S23 Ultra', step: '자주검증', order: '2', simHistory: 'none', verification: 'none', result: 'none', manager: '지드래곤', finalDate: '2026-01-10' },
    { id: 33, bopType: '양산', basicModel: 'SM-A146', project: 'A14', step: 'DV', order: '최종', simHistory: 'dv_final', verification: 'ready', result: 'complete', manager: '태양', finalDate: '2026-01-11' },
    { id: 34, bopType: 'Master', basicModel: 'SM-X910', project: 'Tab S9 Ultra', step: 'PV', order: '2', simHistory: 'pv_final', verification: 'ready', result: 'processing', manager: '대성', finalDate: '2026-01-12' },
    { id: 35, bopType: '개발', basicModel: 'SM-F711', project: 'Z Flip 3', step: '자주검증', order: '1', simHistory: 'self_2', verification: 'ready', result: 'none', manager: '탑', finalDate: '2026-01-13' },
    { id: 36, bopType: '설계', basicModel: 'SM-M236', project: 'M23', step: 'DV', order: '1', simHistory: 'none', verification: 'none', result: 'none', manager: '제니', finalDate: '2026-01-14' },
    { id: 37, bopType: '개발', basicModel: 'SM-A356', project: 'A35', step: 'PV', order: '최종', simHistory: 'pv_final', verification: 'ready', result: 'complete', manager: '리사', finalDate: '2026-01-15' },
    { id: 38, bopType: '양산', basicModel: 'SM-S921', project: 'S24', step: '자주검증', order: '2', simHistory: 'none', verification: 'none', result: 'none', manager: '로제', finalDate: '2026-01-16' },
    { id: 39, bopType: 'Master', basicModel: 'SM-Z910', project: 'Z Fold 7', step: 'DV', order: '최종', simHistory: 'dv_final', verification: 'ready', result: 'complete', manager: '지수', finalDate: '2026-01-17' },
    { id: 40, bopType: '개발', basicModel: 'SM-X510', project: 'Tab S9 FE', step: 'PV', order: '1', simHistory: 'pv_final', verification: 'ready', result: 'complete', manager: '뷔', finalDate: '2026-01-18' },
    { id: 41, bopType: '설계', basicModel: 'SM-A057', project: 'A05s', step: '자주검증', order: '1', simHistory: 'none', verification: 'none', result: 'none', manager: '정국', finalDate: '2026-01-19' },
    { id: 42, bopType: '개발', basicModel: 'SM-S926', project: 'S24+', step: 'DV', order: '2', simHistory: 'dv_final', verification: 'ready', result: 'processing', manager: '지민', finalDate: '2026-01-20' },
    { id: 43, bopType: '양산', basicModel: 'SM-M146', project: 'M14', step: 'PV', order: '최종', simHistory: 'pv_final', verification: 'ready', result: 'complete', manager: 'RM', finalDate: '2026-01-21' },
    { id: 44, bopType: 'Master', basicModel: 'SM-F741', project: 'Z Flip 7', step: '자주검증', order: '2', simHistory: 'self_2', verification: 'ready', result: 'none', manager: '진', finalDate: '2026-01-22' },
    { id: 45, bopType: '개발', basicModel: 'SM-A256', project: 'A25', step: 'DV', order: '1', simHistory: 'none', verification: 'none', result: 'none', manager: '슈가', finalDate: '2026-01-23' },
    { id: 46, bopType: '설계', basicModel: 'SM-X210', project: 'Tab A9+', step: 'PV', order: '2', simHistory: 'pv_final', verification: 'ready', result: 'complete', manager: '제이홉', finalDate: '2026-01-24' },
    { id: 47, bopType: '개발', basicModel: 'SM-S951', project: 'S26', step: '자주검증', order: '최종', simHistory: 'none', verification: 'none', result: 'none', manager: '차은우', finalDate: '2026-01-25' },
    { id: 48, bopType: '양산', basicModel: 'SM-F956', project: 'Z Fold 6+', step: 'DV', order: '1', simHistory: 'dv_final', verification: 'ready', result: 'complete', manager: '황민현', finalDate: '2026-01-26' },
    { id: 49, bopType: 'Master', basicModel: 'SM-E146', project: 'F14', step: 'PV', order: '2', simHistory: 'none', verification: 'none', result: 'none', manager: '강다니엘', finalDate: '2026-01-27' },
    { id: 50, bopType: '개발', basicModel: 'SM-M556', project: 'M55', step: '자주검증', order: '최종', simHistory: 'self_2', verification: 'ready', result: 'none', manager: '박지훈', finalDate: '2026-01-28' },
];


// 1. 월별 시뮬레이션 추세 (Line Chart)
export const monthlySimulationData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    datasets: [
        {
            label: '2025 시뮬레이션 수행 건수',
            backgroundColor: '#4f46e5', // Primary Color
            borderColor: '#4f46e5',
            data: [40, 39, 10, 40, 39, 80, 40, 60, 55, 70, 65, 90],
            tension: 0.4
        },
        {
            label: '2024 수행 건수',
            backgroundColor: '#e5e7eb',
            borderColor: '#9ca3af',
            data: [20, 25, 30, 28, 35, 40, 38, 45, 42, 50, 48, 55],
            tension: 0.4,
            borderDash: [5, 5]
        }
    ]
};

// 2. 프로젝트별 성공/실패 현황 (Bar Chart)
export const projectStatusData = {
    labels: ['Galaxy S25', 'Z Fold 6', 'Z Flip 6', 'Tab S10', 'Watch 7'],
    datasets: [
        {
            label: 'Success',
            backgroundColor: '#22c55e', // Green
            data: [85, 70, 80, 90, 60]
        },
        {
            label: 'Failure',
            backgroundColor: '#ef4444', // Red
            data: [15, 30, 20, 10, 40]
        }
    ]
};

// 3. 에러 유형 분포 (Doughnut Chart)
export const errorDistributionData = {
    labels: ['Data Missing', 'Simulation Timeout', 'Parameter Error', 'System Crash', 'Unknown'],
    datasets: [
        {
            backgroundColor: ['#f87171', '#fbbf24', '#60a5fa', '#a78bfa', '#9ca3af'],
            data: [30, 20, 25, 15, 10]
        }
    ]
};

// 4. 팀별 성과 지표 (Radar Chart)
export const teamPerformanceData = {
    labels: ['속도', '정확도', '비용 절감', '혁신성', '문서화', '협업'],
    datasets: [
        {
            label: '개발 1팀',
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: '#4f46e5',
            pointBackgroundColor: '#4f46e5',
            data: [90, 85, 70, 80, 60, 95]
        },
        {
            label: '개발 2팀',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            borderColor: '#22c55e',
            pointBackgroundColor: '#22c55e',
            data: [75, 95, 90, 70, 85, 80]
        }
    ]
};