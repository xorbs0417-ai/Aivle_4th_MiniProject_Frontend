import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                borderRadius: 3,
                background: 'linear-gradient(90deg, #1e88e5 0%, #42a5f5 50%, #64b5f6 100%)',
                color: '#fff',
                boxShadow: '0px 10px 30px rgba(30, 136, 229, 0.2)',
            }}
        >
            <Toolbar sx={{ py: 1.5 }}>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                    도서 관리 시스템
                </Typography>
                <Stack direction="row" spacing={1.5}>
                    <Button color="inherit" onClick={() => navigate('/')}>홈</Button>
                    <Button color="inherit" onClick={() => navigate('/books')}>
                        도서 목록
                    </Button>
                    <Button variant="contained" sx={{ color: '#1e88e5', backgroundColor: '#fff' }}>
                        Login
                    </Button>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
