import { Outlet, Link } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Header from './components/Header';

export default function App() {
    return (
        <Container maxWidth="md">
            <Header />
            <Box sx={{ my: 3 }}>
                <Outlet />
            </Box>
            <Box sx={{ my: 3 }}>
                <Link to="/">Home</Link> | <Link to="/about">About</Link>
            </Box>
        </Container>
    );
}
