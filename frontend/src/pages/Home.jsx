import { useEffect, useState } from 'react';
import { Typography, Stack, Button } from '@mui/material';
import api from '../app/axios';

export default function Home() {
    const [message, setMessage] = useState('Ready');

    async function fetchPing() {
        try {
            const res = await api.get('/ping'); // 백엔드에 /api/ping 준비되어 있으면 응답
            setMessage(res.data?.message ?? 'OK');
        } catch (e) {
            setMessage(e.message);
        }
    }

    useEffect(() => {
        // 초기 로딩 시 호출하고 싶으면
        // fetchPing();
    }, []);

    return (
        <Stack spacing={2}>
            <Typography variant="h4">Home</Typography>
            <Typography>Server says: {message}</Typography>
            <Button onClick={fetchPing}>Call API</Button>
        </Stack>
    );
}
