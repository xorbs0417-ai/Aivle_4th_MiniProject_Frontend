import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                py: 10,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
                borderRadius: 4,
            }}
        >
            <Stack spacing={2} alignItems="center">
                <Typography variant="h3" fontWeight={800}>
                    404
                </Typography>
                <Typography variant="h6">페이지를 찾을 수 없습니다.</Typography>
                <Typography color="text.secondary">
                    주소를 다시 확인하거나 홈으로 돌아가 주세요.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button variant="contained" onClick={() => navigate('/')}>홈으로 이동</Button>
                    <Button variant="outlined" onClick={() => navigate('/books')}>
                        도서 목록 보기
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}