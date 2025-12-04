import { Box, Typography } from '@mui/material';

export default function NotFound() {
    return (
        <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h5">페이지를 찾을 수 없습니다.</Typography>
        </Box>
    );
}