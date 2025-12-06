import { Typography, Paper, Stack, Divider } from '@mui/material';

export default function About() {
    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                border: '1px solid #e5e7eb',
                boxShadow: '0 10px 26px rgba(15, 23, 42, 0.08)',
                backgroundColor: '#fff',
            }}
        >
            <Stack spacing={2}>
                <Typography variant="h4" fontWeight={800}>
                    서비스 소개
                </Typography>
                <Typography color="text.secondary">
                    도서 관리 시스템은 팀에서 함께 사용하는 도서의 등록, 열람, 공유를 돕기 위해 만들어졌습니다.
                    직관적인 카드형 목록과 부드러운 색감을 통해 누구나 부담 없이 사용할 수 있습니다.
                </Typography>
                <Divider />
                <Typography variant="h6" fontWeight={700}>
                    주요 기능
                </Typography>
                <Typography color="text.secondary">
                    • 도서 등록: 제목, 저자, 카테고리, 소개를 입력해 새 책을 손쉽게 추가합니다.
                    <br />• 도서 목록: 카테고리와 저자 정보를 한눈에 확인하고 상세 페이지로 이동할 수 있습니다.
                    <br />• 상세 정보: 책 소개와 메타데이터를 더 보기 쉽게 정돈했습니다.
                </Typography>
            </Stack>
        </Paper>
    );
}
