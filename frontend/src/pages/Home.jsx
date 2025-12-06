import { useEffect, useState } from 'react';
import {
    Typography,
    Stack,
    Button,
    Grid,
    Paper,
    Chip,
    Divider,
    Box,
} from '@mui/material';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import PlaylistAddCheckCircleOutlinedIcon from '@mui/icons-material/PlaylistAddCheckCircleOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import api from '../app/axios';

export default function Home() {
    const [message, setMessage] = useState('Ready');

    async function fetchPing() {
        try {
            const res = await api.get('/ping');
            setMessage(res.data?.message ?? 'OK');
        } catch (e) {
            setMessage(e.message);
        }
    }

    useEffect(() => {}, []);

    return (
        <Stack spacing={4}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #f3f7ff 100%)',
                    boxShadow: '0 10px 40px rgba(25, 118, 210, 0.12)',
                }}
            >
                <Stack spacing={2} maxWidth={760}>
                    <Chip
                        label="Aivle Library"
                        color="primary"
                        variant="outlined"
                        sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
                    />
                    <Typography variant="h3" component="h1" fontWeight={800}>
                        한눈에 관리하는 지식 서재
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        도서 등록부터 상세 조회까지, 필요한 정보를 깔끔하게 모아 보세요. 깔끔한 목록과
                        카드 뷰로 팀 도서관을 더 쉽고 빠르게 운영할 수 있습니다.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                        <Button size="large" onClick={() => fetchPing()}>
                            서버 연결 확인
                        </Button>
                        <Button size="large" variant="outlined" href="/books">
                            도서 목록 보기
                        </Button>
                        <Typography variant="body2" color="text.secondary">
                            Server says: {message}
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 3,
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#fff',
                    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" fontWeight={700}>
                        자주 사용하는 기능
                    </Typography>
                    <Button variant="outlined" size="small" href="/books/new">
                        신규 도서 등록
                    </Button>
                </Stack>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2.5}>
                    {[
                        {
                            title: '책 목록 한눈에 보기',
                            description: '카드 레이아웃으로 저자, 카테고리를 직관적으로 확인하세요.',
                            Icon: LibraryBooksOutlinedIcon,
                        },
                        {
                            title: '등록 현황 추적',
                            description: '새로 추가한 도서를 바로 확인하고 필요 시 상세정보를 수정합니다.',
                            Icon: PlaylistAddCheckCircleOutlinedIcon,
                        },
                        {
                            title: '읽을거리 탐색',
                            description: '관심 카테고리를 확인하고 팀원들에게 추천할 책을 골라 보세요.',
                            Icon: AutoStoriesOutlinedIcon,
                        },
                    ].map(({ title, description, Icon }) => (
                        <Grid item xs={12} sm={6} md={4} key={title}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    height: '100%',
                                    borderRadius: 3,
                                    border: '1px solid #e5e7eb',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: '#90caf9',
                                        boxShadow: '0 14px 30px rgba(66, 165, 245, 0.15)',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        backgroundColor: '#e8f3ff',
                                        color: '#1e88e5',
                                        display: 'grid',
                                        placeItems: 'center',
                                        mb: 1.5,
                                    }}
                                >
                                    <Icon />
                                </Box>
                                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                    {title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Stack>
    );
}
