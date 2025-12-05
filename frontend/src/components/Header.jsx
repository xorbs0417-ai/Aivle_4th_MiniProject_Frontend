import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function Header() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }} >
                    도서 관리 시스템
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    );}