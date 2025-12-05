import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper } from "@mui/material";

// 데이터를 보여주기 위해 리스트 페이지에 있던 가짜 데이터를 가져왔습니다.
// (나중에는 서버에서 id로 조회해서 가져오는 방식으로 바뀝니다)
const mockBooksData = [
    {
        id: 1,
        title: "작가의 산책",
        content: "이 책은 작가가 숲을 산책하며 느낀 감정을 담은 에세이입니다...",
        createdAt: "2025-12-04",
        coverUrl: "https://via.placeholder.com/300", // 이미지를 좀 크게 봅니다
    },
    {
        id: 2,
        title: "겨울의 기록",
        content: "추운 겨울, 따뜻한 커피 한 잔과 함께 읽기 좋은 소설입니다...",
        createdAt: "2025-12-03",
        coverUrl: "https://via.placeholder.com/300",
    },
];

export default function BookDetailPage() {
    const { id } = useParams(); // 주소창의 :id 부분(숫자)을 가져옵니다.
    const navigate = useNavigate();

    // 가져온 id와 일치하는 책을 mockBooksData에서 찾습니다.
    // 주소창의 id는 문자열이라 숫자로 변환(Number)해서 비교합니다.
    const book = mockBooksData.find((b) => b.id === Number(id));

    if (!book) {
        return <div style={{ padding: 20 }}>책을 찾을 수 없습니다.</div>;
    }

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <img
                    src={book.coverUrl}
                    alt={book.title}
                    style={{ width: '100%', borderRadius: '4px', marginBottom: '20px' }}
                />
                <Typography variant="h4" gutterBottom>
                    {book.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    등록일: {book.createdAt}
                </Typography>
                <Typography variant="body1" paragraph sx={{ marginTop: 2 }}>
                    {book.content}
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => navigate('/books')} // 목록으로 돌아가기
                    sx={{ marginTop: 2 }}
                >
                    목록으로
                </Button>
            </Paper>
        </Container>
    );
}