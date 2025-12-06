import { Outlet, Link } from 'react-router-dom';
import { Container, Box, Typography, Stack, Divider } from '@mui/material';
import Header from './components/Header';

export default function App() {
    return (
        <Box
            className="app-shell"
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f3f6ff 0%, #f9fbff 50%, #f3f6ff 100%)',
                pb: 6,
            }}
        >
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Header />
                <Box sx={{ my: 4 }}>
                    <Outlet />
                </Box>
                <Divider sx={{ mt: 6, mb: 3 }} />
                <Stack
                    component="footer"
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={1}
                    justifyContent="space-between"
                >
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} 도서 관리 시스템
                    </Typography>
                    <Stack direction="row" spacing={2} divider={<span>·</span>}>
                        <Link to="/">홈</Link>
                        <Link to="/books">도서 목록</Link>
                        <Link to="/about">서비스 소개</Link>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}
