export default defineAppConfig({
    ui: {
        // 전역 색상 설정
        primary: 'green',
        gray: 'slate',

        // 컴포넌트별 설정
        button: {
            // 스타일 클래스는 slots.base에 작성
            slots: {
                base: 'rounded-md'
            },
            // size, color 같은 Variant 기본값 설정
            defaultVariants: {
                size: 'md'
            }
        },
        input: {
            slots: {
                base: 'rounded-md'
            }
        },
        selectMenu: {
            slots: {
                // 드롭다운 트리거(버튼)의 둥글기 적용
                base: 'rounded-md'
            }
        }
    }
})